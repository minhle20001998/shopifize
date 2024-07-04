import { Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string; 

  @OneToMany(() => CartItem, (item) => item.cart, {cascade: true})
  cart_item: CartItem[]

  @OneToOne(() => User, (user) => user.cart)
  user: User;
}