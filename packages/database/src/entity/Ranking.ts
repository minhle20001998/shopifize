import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: 'view_count'})
  view_count: number;

  @OneToOne(() => Product, product => product.id, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  product: Product
 }