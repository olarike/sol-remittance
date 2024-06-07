import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './User';

export enum TransactionState {
  INITIATED = 'initiated',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum TransactionType {
  CONVERSION = 'conversion',
  DEPOSIT = 'deposit',
  REMITTANCE = 'remittance'
}

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Use definite assignment assertion

  @Column()
  amount!: number; // Use definite assignment assertion

  @Column()
  currency!: string; // Use definite assignment assertion

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type!: TransactionType; // Use definite assignment assertion

  @Column({
    type: 'enum',
    enum: TransactionState
  })
  state!: TransactionState; // Use definite assignment assertion

  @Column({ nullable: true })
  idempotencyKey!: string; // Use definite assignment assertion

  @ManyToOne(() => User, user => user.transactions)
  user!: User; // Use definite assignment assertion
}
