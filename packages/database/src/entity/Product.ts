import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductVariant } from "./ProductVariant";
import { SubCategory } from "./SubCategory";
import { Category } from "./Category";
import { Ranking } from "./Ranking";
import { Comment } from "./Comment";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToOne(() => Category)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.product, {onDelete: 'CASCADE'})
  comment: Comment;

  @ManyToMany(() => SubCategory)
  @JoinTable()
  subCategory: SubCategory[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[]

  @OneToOne(() => Ranking, ranking => ranking.product, {onDelete: 'CASCADE'})
  productRanking: Ranking

  @CreateDateColumn({type: 'timestamp with time zone'})
  created_at: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updated_at: Date
}