import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { ProductStatus } from "./ProductStatus";
import { ColumnNumericTransformer } from "../helpers";
import { Comment } from "./Comment";

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @Column()
  imgSrc: string;

  @Column({ type: "decimal", transformer: new ColumnNumericTransformer() })
  price: number;

  @Column({ nullable: true, type: "decimal", transformer: new ColumnNumericTransformer() })
  salePrice: number | null;

  @OneToMany(() => Comment, (comment) => comment.product_variant, {onDelete: 'CASCADE'})
  comment: Comment;

  @ManyToOne(() => Product, (product) => product.productVariants)
  product: Product

  @OneToOne(() => ProductStatus, productStatus => productStatus.productVariant, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  productStatus: ProductStatus
}