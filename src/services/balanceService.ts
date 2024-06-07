import { User } from '../entities/User';
import { Ledger, LedgerType } from '../entities/Ledger';

export class BalanceService {
  async updateBalance(user: User, amount: number, currency: string, type: LedgerType): Promise<void> {
    let newBalance;
    if (currency === 'SOL') {
      newBalance = type === LedgerType.CREDIT ? user.balanceSOL + amount : user.balanceSOL - amount;
      if (newBalance < 0) {
        throw new Error('Insufficient SOL balance');
      }
      user.balanceSOL = newBalance;
    } else if (currency === 'USD') {
      newBalance = type === LedgerType.CREDIT ? user.balanceUSD + amount : user.balanceUSD - amount;
      if (newBalance < 0) {
        throw new Error('Insufficient USD balance');
      }
      user.balanceUSD = newBalance;
    }
    await user.save();

    const ledgerEntry = Ledger.create({ user, amount, currency, type });
    await ledgerEntry.save();
  }

  async ensureSufficientFunds(user: User, amount: number, currency: string): Promise<void> {
    if (currency === 'SOL' && user.balanceSOL < amount) {
      throw new Error('Insufficient SOL balance');
    }
    if (currency === 'USD' && user.balanceUSD < amount) {
      throw new Error('Insufficient USD balance');
    }
  }

  async reconcile(user: User): Promise<void> {
    const ledgerEntries = await Ledger.find({ where: { user } });

    const totalCreditSOL = ledgerEntries
      .filter(entry => entry.currency === 'SOL' && entry.type === LedgerType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalDebitSOL = ledgerEntries
      .filter(entry => entry.currency === 'SOL' && entry.type === LedgerType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCreditUSD = ledgerEntries
      .filter(entry => entry.currency === 'USD' && entry.type === LedgerType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalDebitUSD = ledgerEntries
      .filter(entry => entry.currency === 'USD' && entry.type === LedgerType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    user.balanceSOL = totalCreditSOL - totalDebitSOL;
    user.balanceUSD = totalCreditUSD - totalDebitUSD;

    await user.save();
  }
}
