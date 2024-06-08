import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum LedgerType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity()
export class Ledger extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @Column({
    type: 'enum',
    enum: LedgerType,
  })
  type!: LedgerType;

  @Column()
  currency!: string;

  @ManyToOne(() => User, user => user.ledgerEntries)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
