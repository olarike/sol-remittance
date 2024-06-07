import { Router } from 'express';
import { ExchangeController } from '../controllers/exchangeController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const exchangeController = new ExchangeController();

router.post('/convert', authenticate, exchangeController.convertSOLToUSD);

export default router;
