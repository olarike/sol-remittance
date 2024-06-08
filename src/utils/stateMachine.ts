import { Transaction, TransactionState } from '../entities/Transaction';

type AllowedTransitions = {
  [key in TransactionState]: TransactionState[];
};

const allowedTransitions: AllowedTransitions = {
  [TransactionState.INITIATED]: [TransactionState.PENDING, TransactionState.FAILED],
  [TransactionState.PENDING]: [TransactionState.COMPLETED, TransactionState.FAILED],
  [TransactionState.COMPLETED]: [],
  [TransactionState.FAILED]: [],
};

export class StateMachine {
  static async transition(transaction: Transaction, newState: TransactionState): Promise<Transaction> {
    if (!allowedTransitions[transaction.state].includes(newState)) {
      throw new Error(`Invalid state transition from ${transaction.state} to ${newState}`);
    }

    transaction.state = newState;
    await transaction.save();
    return transaction;
  }
}
