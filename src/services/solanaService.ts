import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Transaction, TransactionType } from '../entities/Transaction';
import { User } from '../entities/User';
import { NotificationService } from './notificationService';

const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const notificationService = new NotificationService();

export class SolanaService {
  async createWallet(): Promise<Keypair> {
    const wallet = Keypair.generate();
    return wallet;
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  async transferSOL(from: Keypair, to: PublicKey, amount: number, user: User): Promise<string> {
    const transaction = await connection.requestAirdrop(from.publicKey, amount * LAMPORTS_PER_SOL);

    const newTransaction = Transaction.create({
      amount,
      currency: 'SOL',
      type: TransactionType.DEPOSIT,
      user,
    });
    await newTransaction.save();

    // Send notification
    await notificationService.sendEmail(user.email, 'Transaction Completed', `Your transaction of ${amount} SOL has been completed.`);
    // Optionally send SMS if user has a phone number
    // await notificationService.sendSMS(user.phoneNumber, `Your transaction of ${amount} SOL has been completed.`);

    return transaction;
  }
}
