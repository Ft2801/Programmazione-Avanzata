import { Request, Response } from 'express';
import * as producerService from '../services/producer.service';
import { catchAsync } from '../utils/catchAsync';

export const updateOfferingsController = catchAsync(async (req: Request, res: Response) => {
  // req.user è stato aggiunto dal middleware 'protect'
  const userId = req.user!.id;
  const { date, updates } = req.body;

  const updatedOfferings = await producerService.updateProducerOfferings(userId, date, updates);

  res.status(200).json({
    status: 'success',
    message: 'Offerings updated successfully.',
    data: {
      offerings: updatedOfferings,
    },
  });
});