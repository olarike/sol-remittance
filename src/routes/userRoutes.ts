import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthService } from '../services/authService';
import { authenticate } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';

const router = Router();
const userController = new UserController();
const authService = new AuthService();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', validationMiddleware(RegisterDto), async (req, res, next) => {
  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', validationMiddleware(LoginDto), async (req, res, next) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/users', authenticate, userController.createUser);
router.get('/users/:id/balance', authenticate, userController.getBalance);
router.get('/users/:id/transactions', authenticate, userController.getTransactionHistory);

export default router;
