import { User } from '../entities/User';
import { Transaction, TransactionState } from '../entities/Transaction';
import { BalanceService } from './balanceService';
import { NotificationService } from './notificationService';

const balanceService = new BalanceService();
const notificationService = new NotificationService();

export class RefundService {
  async processRefund(transactionId: number, user: User): Promise<void> {
    const transaction = await Transaction.findOne({ id: transactionId, user });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.state !== TransactionState.FAILED) {
      throw new Error('Only failed transactions can be refunded');
    }

    const refundAmount = transaction.amount;
    const currency = transaction.currency;

    await balanceService.updateBalance(user, refundAmount, currency, 'credit');

    await notificationService.sendEmail(
      user.email,
      'Refund Processed',
      `Your refund of ${refundAmount} ${currency} for transaction ${transaction.id} has been processed.`
    );
  }
}
