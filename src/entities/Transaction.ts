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
  id!: number;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionState
  })
  state!: TransactionState;

  @Column({ nullable: true })
  idempotencyKey?: string;

  @ManyToOne(() => User, user => user.transactions)
  user!: User;

  @Column({ type: 'float', nullable: true })
  lockedExchangeRate?: number;

  @Column({ type: 'timestamp', nullable: true })
  rateLockExpiration?: Date;
}
