import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

export const registerController = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});