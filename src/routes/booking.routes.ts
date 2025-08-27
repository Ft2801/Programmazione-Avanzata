import { Router } from 'express';
import { createBookingController, updateBookingController } from '../controllers/booking.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createBookingSchema, updateBookingSchema } from '../validators/booking.validator';

const router = Router();

// Tutte le rotte in questo file sono protette
router.use(protect);

router.post(
  '/', // Corrisponde a POST /api/v1/bookings
  restrictTo('consumer'), // Solo i consumatori possono prenotare
  validateRequest(createBookingSchema),
  createBookingController
);

router.put(
  '/:id', // Corrisponde a PUT /api/v1/bookings/123
  restrictTo('consumer'),
  validateRequest(updateBookingSchema),
  updateBookingController
);

export default router;