import axios from 'axios';
import { publishToQueue } from '../utils/rabbitmq';
import { calculateFee, applyFee } from '../utils/feeManagement';
import { User } from '../entities/User';
import { Transaction, TransactionState, TransactionType } from '../entities/Transaction';
import { NotificationService } from './notificationService';
import { StateMachine } from '../utils/stateMachine';
import { BalanceService } from './balanceService';
import { ComplianceService } from './complianceService';
import { LedgerType } from '../entities/Ledger';

const notificationService = new NotificationService();
const balanceService = new BalanceService();
const complianceService = new ComplianceService();

export class RemittanceService {
  async sendMoney(accountDetails: any, amountUSD: number, user: User, idempotencyKey: string): Promise<Transaction> {
    let transaction = await Transaction.findOne({ where: { idempotencyKey } });

    if (transaction) {
      if (transaction.state === TransactionState.COMPLETED) {
        return transaction;
      }
      throw new Error('Transaction is already in process');
    }

    transaction = Transaction.create({
      amount: amountUSD,
      currency: 'USD',
      type: TransactionType.REMITTANCE,
      user,
      state: TransactionState.INITIATED,
      idempotencyKey,
    });
    await transaction.save();

    try {
      await StateMachine.transition(transaction, TransactionState.PENDING);

      await balanceService.ensureSufficientFunds(user, amountUSD, 'USD');
      await balanceService.updateBalance(user, amountUSD, 'USD', LedgerType.DEBIT);

      const fee = calculateFee(amountUSD, 0.01);
      const amountAfterFee = applyFee(amountUSD, fee);

      const msg = { accountDetails, amountUSD: amountAfterFee, user };
      await publishToQueue('remittances', JSON.stringify(msg));

      await balanceService.updateBalance(user, amountAfterFee, 'USD', LedgerType.DEBIT);

      await StateMachine.transition(transaction, TransactionState.COMPLETED);

      await notificationService.sendEmail(user.email, 'Remittance Initiated', `Your remittance of ${amountAfterFee} USD has been initiated. A fee of ${fee} USD was applied.`);
      
      await complianceService.checkForAML(transaction);

      return transaction;
    } catch (error) {
      await StateMachine.transition(transaction, TransactionState.FAILED);
      throw error;
    }
  }

  async sendUSDToBank(accountDetails: any, amountUSD: number, user: User, idempotencyKey: string): Promise<Transaction> {
    let transaction = await Transaction.findOne({ where: { idempotencyKey } });

    if (transaction) {
      if (transaction.state === TransactionState.COMPLETED) {
        return transaction;
      }
      throw new Error('Transaction is already in process');
    }

    transaction = Transaction.create({
      amount: amountUSD,
      currency: 'USD',
      type: TransactionType.REMITTANCE,
      user,
      state: TransactionState.INITIATED,
      idempotencyKey,
    });
    await transaction.save();

    try {
      await StateMachine.transition(transaction, TransactionState.PENDING);

      await balanceService.ensureSufficientFunds(user, amountUSD, 'USD');
      await balanceService.updateBalance(user, amountUSD, 'USD', LedgerType.DEBIT);

      // Simulate sending money to the bank using Remitly or Send
      // This is a mock implementation; replace with actual API calls to Remitly or Send
      const remitlyResponse = await axios.post('https://remitly-api.com/send', { accountDetails, amountUSD });

      if (remitlyResponse.status === 200) {
        await balanceService.updateBalance(user, amountUSD, 'USD', LedgerType.CREDIT);
        await StateMachine.transition(transaction, TransactionState.COMPLETED);
        await notificationService.sendEmail(user.email, 'Remittance Completed', `Your remittance of ${amountUSD} USD to the bank has been completed.`);
      } else {
        throw new Error('Remittance failed');
      }

      return transaction;
    } catch (error) {
      await StateMachine.transition(transaction, TransactionState.FAILED);
      throw error;
    }
  }

  async getTransactionStatus(transactionId: string): Promise<string> {
    try {
      // Replace with actual remittance service API endpoint
      const response = await axios.get(`https://remittance-api.com/transaction/${transactionId}/status`);
      return response.data.status; // 'completed', 'failed', etc.
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      throw new Error('Failed to fetch transaction status');
    }
  }
}
