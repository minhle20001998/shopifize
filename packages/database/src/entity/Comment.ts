import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  comment: string

  @Column()
  rating: number

  @ManyToOne(() => ProductVariant, productVariant => productVariant.comment)
  product_variant: ProductVariant

  @ManyToOne(() => User, user => user.comment)
  user: User

  @CreateDateColumn({type: 'timestamp with time zone'})
  created_at: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updated_at: Date
}