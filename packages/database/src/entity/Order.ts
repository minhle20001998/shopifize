import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { ORDER_STATUS } from "../helpers/enums";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ORDER_STATUS,
    default: ORDER_STATUS.PENDING
  })
  status: ORDER_STATUS

  @Column()
  total_price: number

  @ManyToOne(() => User, (user) => user.order)
  user: User

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[]

  @CreateDateColumn({type: 'timestamp with time zone'})
  created_at: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updated_at: Date
}