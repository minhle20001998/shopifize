import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./Order";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../helpers/enums";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number

  @Column({
    type: "enum",
    enum: PAYMENT_METHOD,
    default: PAYMENT_METHOD.CREDIT_CARD,
  })
  paymentMethod: PAYMENT_METHOD;

  @Column({
    type: "enum",
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PAYMENT_STATUS;

  @ManyToOne(() => Order)
  order: Order;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date
}