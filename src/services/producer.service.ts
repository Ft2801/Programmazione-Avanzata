import { ProducerOffering, ProducerProfile } from '../models';
import { AppError } from '../utils/AppError';
import sequelize from '../config/database';

interface OfferingUpdate {
  hour: number;
  availableKwh?: number;
  costPerKwh?: number;
}

/**
 * Aggiorna o crea le offerte per un produttore in una data specifica.
 * @param userId L'ID dell'utente produttore.
 * @param date La data per cui aggiornare le offerte.
 * @param updates Un array di oggetti con gli aggiornamenti orari.
 */
export const updateProducerOfferings = async (userId: number, date: string, updates: OfferingUpdate[]) => {
  // 1. Trova il profilo del produttore associato all'utente loggato
  const producerProfile = await ProducerProfile.findOne({ where: { userId } });
  if (!producerProfile) {
    throw new AppError('Producer profile not found for the current user.', 404);
  }

  const producerProfileId = producerProfile.id;

  // 2. Esegui tutte le operazioni in una transazione per garantire la consistenza
  const transaction = await sequelize.transaction();
  try {
    const upsertPromises = updates.map(async (update) => {
      // 3. Cerca un'offerta esistente
      const existingOffering = await ProducerOffering.findOne({
        where: { producerProfileId, date, hour: update.hour },
        transaction,
      });

      if (existingOffering) {
        // 4. Se esiste, aggiorna i campi forniti
        if (update.availableKwh !== undefined) {
          existingOffering.availableKwh = update.availableKwh;
        }
        if (update.costPerKwh !== undefined) {
          existingOffering.costPerKwh = update.costPerKwh;
        }
        await existingOffering.save({ transaction });
        return existingOffering;
      } else {
        // 5. Se non esiste, crea una nuova offerta
        // Assicurati che entrambi i campi siano presenti per la creazione
        if (update.availableKwh === undefined || update.costPerKwh === undefined) {
            throw new AppError(`For a new offering at hour ${update.hour}, both availableKwh and costPerKwh must be provided.`, 400);
        }
        return ProducerOffering.create({
            producerProfileId,
            date,
            hour: update.hour,
            availableKwh: update.availableKwh,
            costPerKwh: update.costPerKwh,
        }, { transaction });
      }
    });

    const result = await Promise.all(upsertPromises);
    await transaction.commit();
    return result;

  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update offerings.', 500);
  }
};