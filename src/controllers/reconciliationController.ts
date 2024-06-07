import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { Transaction, TransactionState, TransactionType } from '../entities/Transaction';
import { BalanceService } from '../services/balanceService';
import { NotificationService } from '../services/notificationService';
import { BlockchainService } from '../services/blockchainService';
import { RemittanceService } from '../services/remittanceService';

const balanceService = new BalanceService();
const notificationService = new NotificationService();
const blockchainService = new BlockchainService();
const remittanceService = new RemittanceService();

export class ReconciliationController {
  async reconcile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find();
      for (const user of users) {
        await balanceService.reconcile(user);
      }
      res.json({ message: 'Reconciliation completed' });
    } catch (error) {
      next(error);
    }
  }

  async periodicReconcile(): Promise<void> {
    try {
      const transactions = await Transaction.find({ where: { state: TransactionState.COMPLETED } });
      for (const transaction of transactions) {
        const actualStatus = await this.fetchTransactionStatus(transaction);

        if (actualStatus !== 'completed') {
          // Alert for discrepancy
          await notificationService.sendEmail(
            'admin@example.com',
            'Discrepancy Detected',
            `Transaction ${transaction.id} is inconsistent. Recorded status: completed, Actual status: ${actualStatus}.`
          );
        }
      }
    } catch (error) {
      console.error('Error during periodic reconciliation:', error);
    }
  }

  private async fetchTransactionStatus(transaction: Transaction): Promise<string> {
    if (transaction.type === TransactionType.CONVERSION || transaction.type === TransactionType.DEPOSIT) {
      return blockchainService.getTransactionStatus(transaction.id.toString());
    } else if (transaction.type === TransactionType.REMITTANCE) {
      return remittanceService.getTransactionStatus(transaction.id.toString());
    } else {
      throw new Error('Unsupported transaction type');
    }
  }
}
