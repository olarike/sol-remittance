import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';
import { HttpException } from '../middleware/errorMiddleware';

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transactions = await Transaction.find({ relations: ['user'] });
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }
      
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      await user.remove();
      res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
}
