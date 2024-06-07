import { Router } from 'express';
import { TwoFactorController } from '../controllers/twoFactorController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const twoFactorController = new TwoFactorController();

router.post('/generate', authenticate, twoFactorController.generateTwoFactorSecret);
router.post('/verify', authenticate, twoFactorController.verifyTwoFactorToken);

export default router;
