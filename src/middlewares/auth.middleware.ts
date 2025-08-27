import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

// Estendiamo l'interfaccia Request di Express per includere la proprietà `user`
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware per proteggere le rotte.
 * 1. Estrae il token dall'header Authorization.
 * 2. Verifica la validità del token.
 * 3. Trova l'utente corrispondente nel database.
 * 4. Allega l'utente all'oggetto `req`.
 */
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Ottenere il token e controllare se esiste
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2. Verifica del token (jwt.verify può lanciare se non valido)
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: number;
    iat: number;
    exp: number;
  };

  // 3. Controllare se l'utente esiste ancora
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // Aggiungi l'utente alla richiesta per uso futuro
  req.user = currentUser;
  next();
});

/**
 * Middleware per limitare l'accesso a specifici ruoli.
 * Deve essere usato DOPO il middleware `protect`.
 * @param roles Array di ruoli che hanno accesso alla rotta.
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403)); // 403 Forbidden
    }
    next();
  };
};