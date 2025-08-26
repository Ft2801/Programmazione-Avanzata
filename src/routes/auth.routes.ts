import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRequest(registerSchema), registerController);
router.post('/login', validateRequest(loginSchema), loginController);

export default router;