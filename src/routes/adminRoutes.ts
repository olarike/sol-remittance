import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

router.get('/users', authenticate, authorizeAdmin, adminController.getUsers);
router.get('/transactions', authenticate, authorizeAdmin, adminController.getTransactions);
router.delete('/users/:id', authenticate, authorizeAdmin, adminController.deleteUser);

export default router;
