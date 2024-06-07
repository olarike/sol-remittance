import { Request, Response, NextFunction } from 'express';
import { RemittanceService } from '../services/remittanceService';
import { User } from '../entities/User';

const remittanceService = new RemittanceService();

export class RemittanceController {
  async sendMoney(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as User;
      const { accountDetails, amountUSD, idempotencyKey } = req.body;
      const transaction = await remittanceService.sendMoney(accountDetails, amountUSD, user, idempotencyKey);
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }
  async sendUSDToBank(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as User;
      const { accountDetails, amountUSD, idempotencyKey } = req.body;
      const transaction = await remittanceService.sendUSDToBank(accountDetails, amountUSD, user, idempotencyKey);
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }
}
