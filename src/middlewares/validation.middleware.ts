import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
  // Prende il primo messaggio di errore e lo invia (verifica sicurezza)
  const errorMessage = error?.details?.[0]?.message || 'Invalid request';
      return next(new AppError(errorMessage, 400)); // Bad Request
    }
    next();
  };
};