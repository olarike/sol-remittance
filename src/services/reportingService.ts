import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';

export class ReportingService {
  async generateTransactionReport(): Promise<any> {
    const transactions = await Transaction.find();
    // Generate and return report in desired format
    return transactions;
  }

  async generateUserReport(): Promise<any> {
    const users = await User.find();
    // Generate and return report in desired format
    return users;
  }
}
