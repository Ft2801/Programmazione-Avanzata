import { Booking, ConsumerProfile, ProducerOffering, ProducerProfile } from '../models';
import { AppError } from '../utils/AppError';
import sequelize from '../config/database';
import { isBefore, startOfToday, addDays, set, format, subHours } from 'date-fns';

interface CreateBookingData {
  producerId: number;
  date: string; // 'YYYY-MM-DD'
  hour: number;
  requestedKwh: number;
}

export const createBooking = async (userId: number, data: CreateBookingData) => {
  const { producerId, date, hour, requestedKwh } = data;

  // --- VALIDAZIONI PRELIMINARI ---
  // 1. La prenotazione deve essere fatta per il giorno successivo
  const bookingDate = new Date(date);
  const tomorrow = addDays(startOfToday(), 1);
  if (format(bookingDate, 'yyyy-MM-dd') !== format(tomorrow, 'yyyy-MM-dd')) {
    throw new AppError('Bookings can only be made for the next day.', 400);
  }

  // 2. Il tempo limite per la prenotazione è la mezzanotte di oggi
  const deadline = tomorrow;
  if (!isBefore(new Date(), deadline)) {
    throw new AppError('The deadline for booking this slot has passed.', 400);
  }

  const transaction = await sequelize.transaction();

  try {
    // --- RECUPERO DATI E BLOCCO RECORD ---
    // 3. Trova il profilo del consumatore e blocca la riga per l'aggiornamento
    const consumerProfile = await ConsumerProfile.findOne({
      where: { userId },
      lock: transaction.LOCK.UPDATE, // pessimistic lock
      transaction,
    });
    if (!consumerProfile) {
      throw new AppError('Consumer profile not found.', 404);
    }
    
    // 4. Trova l'offerta del produttore per quello slot specifico
    const offering = await ProducerOffering.findOne({
      where: { date, hour },
      include: [{
        model: ProducerProfile,
        as: 'producerProfile',
        where: { id: producerId }, // Filtra per ID del producer
        required: true,
      }],
      transaction,
    });
    if (!offering) {
      throw new AppError('No offering found for the specified producer, date, and hour.', 404);
    }

    // --- LOGICA DI BUSINESS ---
    // 5. Calcola il costo totale della prenotazione
    const totalCost = requestedKwh * Number(offering.costPerKwh);

    // 6. Verifica se il consumatore ha abbastanza credito
    if (Number(consumerProfile.creditBalance) < totalCost) {
      throw new AppError('Insufficient credit balance to make this booking.', 402); // Payment Required
    }

    // 7. Controlla se il consumatore ha già una prenotazione per quella fascia oraria
    // La constraint del DB lo farebbe comunque, ma è bene avere un errore più chiaro
    const slotDateTime = set(new Date(date), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });
    const existingBooking = await Booking.findOne({
        where: { consumerProfileId: consumerProfile.id, slotDateTime },
        transaction
    });
    if (existingBooking) {
        throw new AppError('You already have a booking for this time slot.', 409); // Conflict
    }

    // --- AZIONI SUL DATABASE ---
    // 8. Scala il credito dal bilancio del consumatore
    consumerProfile.creditBalance = Number(consumerProfile.creditBalance) - totalCost;
    await consumerProfile.save({ transaction });

    // 9. Crea la nuova prenotazione
    const newBooking = await Booking.create({
      consumerProfileId: consumerProfile.id,
      producerOfferingId: offering.id,
      slotDateTime,
      requestedKwh,
      totalCost,
      status: 'pending',
    }, { transaction });

    // Se tutto va bene, committa la transazione
    await transaction.commit();

    return newBooking;

  } catch (error: any) {
    // Se qualcosa va storto, fai il rollback
    await transaction.rollback();
    if (error instanceof AppError) throw error; // Riavviva l'errore personalizzato
    // Se è un errore di constraint del DB
    if (error && error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('You already have a booking for this time slot.', 409);
    }
    console.error(error); // Log dell'errore per il debug
    throw new AppError('Failed to create booking.', 500);
  }
};

interface UpdateBookingData {
  requestedKwh: number;
}

export const updateBooking = async (userId: number, bookingId: number, data: UpdateBookingData) => {
  const { requestedKwh } = data;

  const transaction = await sequelize.transaction();

  try {
    // 1. Trova il profilo del consumatore
    const consumerProfile = await ConsumerProfile.findOne({
      where: { userId },
      transaction,
    });
    if (!consumerProfile) {
      throw new AppError('Consumer profile not found.', 404);
    }

    // 2. Trova la prenotazione, assicurandoti che appartenga all'utente e bloccandola
    const booking = await Booking.findOne({
      where: { id: bookingId, consumerProfileId: consumerProfile.id },
      include: [{ model: ProducerOffering, as: 'offering' }],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!booking) {
      throw new AppError('Booking not found or you do not have permission to modify it.', 404);
    }
    if (booking.status !== 'pending') {
      throw new AppError(`Cannot modify a booking with status "${booking.status}".`, 400);
    }

    // 3. Calcola la scadenza per la modifica gratuita
    const deadline = subHours(booking.slotDateTime, 24);
    const isModificationInTime = isBefore(new Date(), deadline);

    const originalCost = Number(booking.totalCost);

    // --- LOGICA DI CANCELLAZIONE ---
    if (requestedKwh === 0) {
      if (isModificationInTime) {
        // Cancellazione in tempo: rimborsa e aggiorna lo stato
        consumerProfile.creditBalance = Number(consumerProfile.creditBalance) + originalCost;
        booking.status = 'cancelled_in_time';
        booking.requestedKwh = 0;
        booking.totalCost = 0;
      } else {
        // Cancellazione in ritardo: nessun rimborso, solo aggiornamento stato
        booking.status = 'cancelled_late';
      }

      await consumerProfile.save({ transaction });
      await booking.save({ transaction });
      await transaction.commit();
      return booking;
    }

    // --- LOGICA DI MODIFICA ---
    if (!isModificationInTime) {
      throw new AppError('Bookings can only be modified up to 24 hours before the slot time.', 403);
    }

    // 4. Se la modifica è in tempo, procedi
    // Rimborsa il costo originale
    consumerProfile.creditBalance = Number(consumerProfile.creditBalance) + originalCost;

    // Calcola il nuovo costo
    const offering = (booking as any).offering as ProducerOffering | undefined;
    if (!offering) {
      throw new AppError('Associated offering not found for this booking.', 500);
    }
    const newCost = requestedKwh * Number(offering.costPerKwh);

    // Controlla se c'è abbastanza credito per il nuovo importo
    if (Number(consumerProfile.creditBalance) < newCost) {
      // Se non c'è abbastanza credito, annulla la transazione (il rimborso non verrà salvato)
      throw new AppError('Insufficient credit balance for the updated booking amount.', 402);
    }

    // Addebita il nuovo costo
    consumerProfile.creditBalance = Number(consumerProfile.creditBalance) - newCost;

    // Aggiorna la prenotazione
    booking.requestedKwh = requestedKwh;
    booking.totalCost = newCost;

    await consumerProfile.save({ transaction });
    const updatedBooking = await booking.save({ transaction });
    await transaction.commit();

    return updatedBooking;

  } catch (error: any) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    console.error(error);
    throw new AppError('Failed to update booking.', 500);
  }
};