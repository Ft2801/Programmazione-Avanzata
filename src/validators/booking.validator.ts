import Joi from 'joi';

export const createBookingSchema = Joi.object({
  // L'ID del produttore viene usato per trovare l'offerta
  producerId: Joi.number().integer().required(),
  // La data per cui si vuole prenotare (deve essere domani)
  date: Joi.date().iso().required(),
  // L'ora dello slot
  hour: Joi.number().integer().min(0).max(23).required(),
  // Il quantitativo richiesto
  requestedKwh: Joi.number().min(0.1).required(),
});

export const updateBookingSchema = Joi.object({
  // Il nuovo quantitativo richiesto. Se 0, è una cancellazione.
  requestedKwh: Joi.number().min(0).required(),
});