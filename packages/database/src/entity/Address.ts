import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Profile } from "./Profile";
import { ColumnNumericTransformer } from "../helpers";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ type: "decimal", transformer: new ColumnNumericTransformer() })
  longitude: number;

  @Column({ type: "decimal", transformer: new ColumnNumericTransformer() })
  latitude: number;

  @ManyToOne(() => Profile, (profile) => profile.address)
  profile: Profile;
}
