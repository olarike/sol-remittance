import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Dispute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Use definite assignment assertion

  @Column()
  transactionId!: number; // Use definite assignment assertion

  @Column()
  reason!: string; // Use definite assignment assertion

  @Column({ default: 'open' })
  status!: string; // Use definite assignment assertion

  @ManyToOne(() => User, user => user.disputes) // Use the correct property
  user!: User; // Use definite assignment assertion

  @CreateDateColumn()
  createdAt!: Date; // Use definite assignment assertion
}
