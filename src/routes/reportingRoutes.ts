import { Router } from 'express';
import { ReportingController } from '../controllers/reportingController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();
const reportingController = new ReportingController();

router.get('/transactions', authenticate, authorizeAdmin, reportingController.getTransactionReport);
router.get('/users', authenticate, authorizeAdmin, reportingController.getUserReport);

export default router;
