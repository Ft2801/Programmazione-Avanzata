import Joi from 'joi';
import { startOfTomorrow } from 'date-fns';

const tomorrowDate = startOfTomorrow();

export const updateOfferingsSchema = Joi.object({
  date: Joi.date()
    .iso()
    .min(tomorrowDate) // La data deve essere da domani in poi
    .required()
    .messages({
      'date.min': 'Offerings can only be updated for future dates.',
    }),
  updates: Joi.array()
    .items(
      Joi.object({
        hour: Joi.number().integer().min(0).max(23).required(),
        availableKwh: Joi.number().min(0),
        costPerKwh: Joi.number().min(0),
      }).or('availableKwh', 'costPerKwh') // Almeno uno dei due deve essere presente
    )
    .min(1)
    .required(),
});