import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from 'typeorm';
import { Transaction } from './Transaction';
import { Dispute } from './Dispute';
import { Ledger } from './Ledger';
import * as bcrypt from 'bcryptjs';

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
  role!: string;

  @Column({ default: 0 })
  balanceSOL!: number;

  @Column({ default: 0 })
  balanceUSD!: number;

  @Column({ default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions!: Transaction[];

  @OneToMany(() => Dispute, dispute => dispute.user)
  disputes!: Dispute[];

  @OneToMany(() => Ledger, ledger => ledger.user)
  ledgerEntries!: Ledger[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
