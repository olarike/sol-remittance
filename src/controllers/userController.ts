import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { SolanaService } from '../services/solanaService';
import { HttpException } from '../middleware/errorMiddleware';
import { PublicKey } from '@solana/web3.js';

const solanaService = new SolanaService();

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [User]
   *     responses:
   *       200:
   *         description: User created successfully
   *       401:
   *         description: Unauthorized
   */
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        throw new HttpException(401, 'Unauthorized');
      }
      
      const wallet = await solanaService.createWallet();
      const newUser = User.create({
        email: user.email,
        publicKey: wallet.publicKey.toBase58(),
        secretKey: wallet.secretKey.toString(),
      });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}/balance:
   *   get:
   *     summary: Get user balance
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User balance retrieved successfully
   *       404:
   *         description: User not found
   */
  async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        const balance = await solanaService.getBalance(new PublicKey(user.publicKey));
        res.json({ balance });
      } else {
        throw new HttpException(404, 'User not found');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}/transactions:
   *   get:
   *     summary: Get user transaction history
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User transactions retrieved successfully
   *       404:
   *         description: User not found
   */
  async getTransactionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      const user = await User.findOne({ where: { id: userId }, relations: ['transactions'] });
      if (user) {
        res.json(user.transactions);
      } else {
        throw new HttpException(404, 'User not found');
      }
    } catch (error) {
      next(error);
    }
  }
}
