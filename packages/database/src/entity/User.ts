import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";
import { Profile } from "./Profile";
import { Comment } from "./Comment";
import { Cart } from "./Cart";
import { Order } from "./Order";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  signed: string;

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[]
}
