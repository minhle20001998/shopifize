import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class ProductStatus {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  quantity: number;

  @Column()
  sold: number

  @Column()
  stars: string

  @Column()
  rating: number

  @OneToOne(() => ProductVariant, productVariant => productVariant.productStatus, { onDelete: "CASCADE" })
  productVariant: ProductVariant
}