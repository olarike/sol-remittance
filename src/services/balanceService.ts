import { User } from '../entities/User';
import { Ledger, LedgerType } from '../entities/Ledger';
import { HttpException } from '../middleware/errorMiddleware';

export class BalanceService {
  async ensureSufficientFunds(user: User, amount: number, currency: string): Promise<void> {
    if (currency === 'SOL') {
      if (user.balanceSOL < amount) {
        throw new HttpException(400, 'Insufficient SOL balance');
      }
    } else if (currency === 'USD') {
      if (user.balanceUSD < amount) {
        throw new HttpException(400, 'Insufficient USD balance');
      }
    } else {
      throw new HttpException(400, 'Unsupported currency');
    }
  }

  async updateBalance(user: User, amount: number, currency: string, type: LedgerType): Promise<void> {
    if (currency === 'SOL') {
      if (type === LedgerType.DEBIT) {
        user.balanceSOL -= amount;
      } else {
        user.balanceSOL += amount;
      }
    } else if (currency === 'USD') {
      if (type === LedgerType.DEBIT) {
        user.balanceUSD -= amount;
      } else {
        user.balanceUSD += amount;
      }
    } else {
      throw new HttpException(400, 'Unsupported currency');
    }
    await user.save();

    const ledgerEntry = Ledger.create({
      user,
      amount,
      type,
      currency,
    });
    await ledgerEntry.save();
  }

  async reconcile(user: User): Promise<void> {
    const transactions = await Ledger.find({ where: { user } });
    let balanceSOL = 0;
    let balanceUSD = 0;

    for (const transaction of transactions) {
      if (transaction.currency === 'SOL') {
        if (transaction.type === LedgerType.CREDIT) {
          balanceSOL += transaction.amount;
        } else {
          balanceSOL -= transaction.amount;
        }
      } else if (transaction.currency === 'USD') {
        if (transaction.type === LedgerType.CREDIT) {
          balanceUSD += transaction.amount;
        } else {
          balanceUSD -= transaction.amount;
        }
      }
    }

    user.balanceSOL = balanceSOL;
    user.balanceUSD = balanceUSD;
    await user.save();
  }
}
