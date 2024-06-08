import axios from 'axios';
import { getExchangeRates } from '../utils/exchangeRate';
import { calculateFee, applyFee } from '../utils/feeManagement';
import { User } from '../entities/User';
import { Transaction, TransactionType, TransactionState } from '../entities/Transaction';
import { NotificationService } from './notificationService';
import { StateMachine } from '../utils/stateMachine';
import { BalanceService } from './balanceService';
import { ComplianceService } from './complianceService';
import { LedgerType } from '../entities/Ledger'; // Import LedgerType

const notificationService = new NotificationService();
const balanceService = new BalanceService();
const complianceService = new ComplianceService();

export class ExchangeService {
  async convertSOLToUSD(amountSOL: number, user: User, idempotencyKey: string): Promise<Transaction> {
    let transaction = await Transaction.findOne({ where: { idempotencyKey } });
    
    if (transaction) {
      if (transaction.state === TransactionState.COMPLETED) {
        return transaction;
      }
      throw new Error('Transaction is already in process');
    }

    transaction = Transaction.create({
      amount: amountSOL,
      currency: 'SOL',
      type: TransactionType.CONVERSION,
      user,
      state: TransactionState.INITIATED,
      idempotencyKey,
    });
    await transaction.save();

    try {
      await StateMachine.transition(transaction, TransactionState.PENDING);

      await balanceService.ensureSufficientFunds(user, amountSOL, 'SOL');
      await balanceService.updateBalance(user, amountSOL, 'SOL', LedgerType.DEBIT);

      const rates = await getExchangeRates();
      const rate = rates['USD'];
      const lockExpiration = new Date();
      lockExpiration.setMinutes(lockExpiration.getMinutes() + 10); // Lock the rate for 10 minutes

      transaction.lockedExchangeRate = rate;
      transaction.rateLockExpiration = lockExpiration;
      await transaction.save();

      const amountUSD = amountSOL * rate;

      const fee = calculateFee(amountUSD, 0.02);
      const amountAfterFee = applyFee(amountUSD, fee);

      await balanceService.updateBalance(user, amountAfterFee, 'USD', LedgerType.CREDIT);

      transaction.amount = amountAfterFee;
      transaction.currency = 'USD';
      await StateMachine.transition(transaction, TransactionState.COMPLETED);

      await notificationService.sendEmail(user.email, 'Conversion Completed', `Your conversion of ${amountSOL} SOL to ${amountAfterFee} USD has been completed at a locked exchange rate of ${rate} USD/SOL. A fee of ${fee} USD was applied.`);
      
      await complianceService.checkForAML(transaction);

      return transaction;
    } catch (error) {
      await StateMachine.transition(transaction, TransactionState.FAILED);
      throw error;
    }
  }
}
