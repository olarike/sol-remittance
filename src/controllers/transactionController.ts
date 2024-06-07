import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';
import { HttpException } from '../middleware/errorMiddleware';

export class TransactionController {
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
