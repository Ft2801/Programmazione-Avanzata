import { Router } from 'express';
import { updateOfferingsController } from '../controllers/producer.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateOfferingsSchema } from '../validators/producer.validator';

const router = Router();

// Tutte le rotte in questo file richiedono che l'utente sia loggato
router.use(protect);

// Questa rotta specifica richiede che l'utente sia un 'producer'
router.put(
  '/me/offerings',
  restrictTo('producer'),
  validateRequest(updateOfferingsSchema),
  updateOfferingsController
);

export default router;