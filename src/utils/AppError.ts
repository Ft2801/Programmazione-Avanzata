/**
 * Classe personalizzata per la gestione degli errori dell'applicazione.
 * Estende la classe Error nativa per includere uno status code HTTP
 * e un flag per distinguere errori operazionali da bug di programmazione.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * @param message Il messaggio di errore da mostrare.
   * @param statusCode Lo status code HTTP associato all'errore (es. 404, 400).
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Gli errori 4xx sono operazionali (prevedibili), gli altri sono errori di programmazione
    this.isOperational = `${statusCode}`.startsWith('4');

    // Mantiene il corretto stack trace per la nostra classe di errore
    Error.captureStackTrace(this, this.constructor);
  }
}