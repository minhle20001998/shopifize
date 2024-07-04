import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Address } from "./Address";
import { GENDER } from "../helpers/enums";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  fullName: string;

  @Column("date", { nullable: true })
  dob: Date;

  @Column({
    type: "enum",
    enum: GENDER,
    default: GENDER.MALE,
    nullable: true,
  })
  gender: GENDER;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  defaultAddress: string;

  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  user: User;

  @OneToMany(() => Address, (address) => address.profile)
  address: Address[];
}
