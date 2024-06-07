import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';
import { Dispute } from './Dispute';
import { Ledger } from './Ledger';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  publicKey!: string;

  @Column()
  secretKey!: string;

  @Column({ default: 'user' })
  role!: string; // Ensure this line is present

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions!: Transaction[];

  @OneToMany(() => Dispute, dispute => dispute.user)
  disputes!: Dispute[];

  @OneToMany(() => Ledger, ledger => ledger.user)
  ledgerEntries!: Ledger[];
}
