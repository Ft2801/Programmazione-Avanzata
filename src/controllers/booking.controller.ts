import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createBookingController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id; // Da middleware 'protect'
  const newBooking = await bookingService.createBooking(userId, req.body);

  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking,
    },
  });
});

export const updateBookingController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const bookingId = parseInt(String(req.params.id), 10);

  if (isNaN(bookingId)) {
    throw new AppError('Invalid booking ID provided.', 400);
  }
  
  const updatedBooking = await bookingService.updateBooking(userId, bookingId, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      booking: updatedBooking,
    },
  });
});