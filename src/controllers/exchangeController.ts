import { Request, Response, NextFunction } from 'express';
import { ExchangeService } from '../services/exchangeService';
import { User } from '../entities/User';
import { Transaction, TransactionState } from '../entities/Transaction';

const exchangeService = new ExchangeService();

export class ExchangeController {
  async convertSOLToUSD(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as User;
      const { amountSOL, idempotencyKey } = req.body;

      // Check if the transaction already exists and its state
      const transaction = await Transaction.findOne({ where: { idempotencyKey } });
      if (transaction) {
        if (transaction.state === TransactionState.COMPLETED) {
          res.json(transaction);
          return;
        }
        throw new Error('Transaction is already in process');
      }

      // Create new transaction and lock exchange rate
      const newTransaction = await exchangeService.convertSOLToUSD(amountSOL, user, idempotencyKey);
      res.json(newTransaction);
    } catch (error) {
      next(error);
    }
  }
}
