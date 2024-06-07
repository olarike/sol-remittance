import { Router } from 'express';
import { DisputeController } from '../controllers/disputeController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();
const disputeController = new DisputeController();

router.post('/raise', authenticate, disputeController.raiseDispute);
router.post('/handle', authenticate, authorizeAdmin, disputeController.handleDispute);

export default router;
