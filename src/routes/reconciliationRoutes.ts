import { Router } from 'express';
import { ReconciliationController } from '../controllers/reconciliationController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();
const reconciliationController = new ReconciliationController();

router.post('/reconcile', authenticate, authorizeAdmin, reconciliationController.reconcile);

export default router;
