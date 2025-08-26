import app from './app';
import { connectDB } from './config/database';

// Assicura che la porta sia definita, con un valore di fallback
const PORT = process.env.PORT || 3000;

/**
 * Funzione principale per avviare il server.
 * Prima si connette al database, poi avvia il server Express.
 */
const startServer = async () => {
  // Connessione al database
  await connectDB();

  // Avvio del server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });

  // Gestione di errori non gestiti a livello globale
  process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Avvia l'applicazione
startServer();