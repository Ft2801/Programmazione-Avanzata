import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware per la gestione centralizzata degli errori.
 * Cattura gli errori e formatta una risposta JSON standard.
 * @param err L'oggetto errore, può essere un AppError personalizzato o un errore generico.
 * @param req L'oggetto richiesta Express.
 * @param res L'oggetto risposta Express.
 * @param next La funzione next di Express.
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log dell'errore per il debug (in un'app di produzione si userebbe un logger come Winston)
  console.error(err);

  // Default a 500 se lo status code non è definito
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Something went very wrong!';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Includi lo stack trace solo in ambiente di sviluppo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};