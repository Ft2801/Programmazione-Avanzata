// Use require at runtime to avoid mismatch between CommonJS/ESM typings for sequelize
const sequelizePkg: any = require('sequelize');
const Sequelize = sequelizePkg.Sequelize || sequelizePkg.default || sequelizePkg;
import dotenv from 'dotenv';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Controlla che tutte le variabili d'ambiente necessarie siano definite
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error('One or more database environment variables are not defined.');
}

// Creazione dell'istanza di Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'postgres',
  logging: false, // Disabilita il logging delle query SQL in console (impostare su console.log per debug)
});

// Inizializza i modelli Sequelize (import dinamico per evitare problemi di import circolare)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const models = require('../models');
  if (models && typeof models.initModels === 'function') {
    models.initModels(sequelize);
  }
} catch (err) {
  // non blocchiamo l'avvio se l'import fallisce in ambienti di build statici
  // loggare per debug
  // console.warn('Could not initialize models:', err);
}

/**
 * Funzione per verificare la connessione al database.
 * @returns {Promise<void>}
 */
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Esce dal processo se la connessione fallisce
  }
};

export default sequelize;