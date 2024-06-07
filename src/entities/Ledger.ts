import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum LedgerType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity()
export class Ledger extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Use definite assignment assertion

  @Column()
  amount!: number; // Use definite assignment assertion

  @Column({
    type: 'enum',
    enum: LedgerType,
  })
  type!: LedgerType; // Use definite assignment assertion

  @Column()
  currency!: string; // Use definite assignment assertion

  @ManyToOne(() => User, user => user.ledgerEntries)
  user!: User; // Use definite assignment assertion

  @CreateDateColumn()
  createdAt!: Date; // Use definite assignment assertion
}
