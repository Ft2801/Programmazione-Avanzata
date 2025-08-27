import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler.middleware';
import authRouter from './routes/auth.routes';
import producerRouter from './routes/producer.routes';
import bookingRouter from './routes/booking.routes';

// Carica le variabili d'ambiente
dotenv.config();

// Crea l'istanza dell'applicazione Express
const app: Application = express();

// --- MIDDLEWARE GLOBALI ---

// 1. Parser per il corpo delle richieste in formato JSON
app.use(express.json());

// 2. Parser per il corpo delle richieste in formato urlencoded
app.use(express.urlencoded({ extended: true }));

// --- ROTTE ---
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/producers', producerRouter);
app.use('/api/v1/bookings', bookingRouter);

// Rotta di test per verificare che il server sia online

/*
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Energy Marketplace API!',
  });
});
*/

// Esempio di come verranno aggiunte le rotte future
// import authRoutes from './routes/auth.routes';
// app.use('/api/v1/auth', authRoutes);


// --- GESTIONE ROTTE NON TROVATE ---

// Middleware per gestire le richieste a endpoint non definiti
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// --- MIDDLEWARE GLOBALE PER LA GESTIONE DEGLI ERRORI ---

// Questo middleware deve essere l'ultimo a essere registrato
app.use(errorHandler);

export default app;