import { Router } from 'express';
import { RemittanceController } from '../controllers/remittanceController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const remittanceController = new RemittanceController();

router.post('/send', authenticate, remittanceController.sendMoney);
router.post('/send-bank', authenticate, remittanceController.sendUSDToBank);

export default router;
