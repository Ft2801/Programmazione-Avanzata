import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('producer', 'consumer').required(),
  profileData: Joi.object().when('role', {
    is: 'producer',
    then: Joi.object({
      energySource: Joi.string().valid('Fossile', 'Eolico', 'Fotovoltaico').required(),
      co2EmissionPerKwh: Joi.number().min(0).required(),
    }).required(),
    otherwise: Joi.object({
      initialCredit: Joi.number().min(0).default(0),
    }).required(),
  }).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});