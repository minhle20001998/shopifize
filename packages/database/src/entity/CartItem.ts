import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string; 
  
  @Column()
  quantity: number

  @ManyToOne(() => Product)
  product: Product

  @ManyToOne(() => ProductVariant)
  product_variant: ProductVariant

  @ManyToOne(() => Cart, (cart) => cart.cart_item)
  cart: Cart;
}