import { GENDER, UserRole } from '@shopifize/database';
import {
  IsString,
  IsEmail,
  Matches,
  Length,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { IsEnumArray } from 'src/decorators/is-enum-array.decorator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email Is Required' })
  email: string;

  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  @Matches(/\d/, { message: 'Password requires a number' })
  @Matches(/[a-z]/, { message: 'Password requires a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password requires an uppercase letter' })
  @Matches(/[^\w]/, { message: 'Password requires a symbol' })
  @IsNotEmpty({ message: 'Password Is Required' })
  password: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsDateString({}, { each: true, message: 'Date of birth is not valid' })
  @IsOptional()
  dob: Date;

  @IsEnum(GENDER, { message: 'Gender is not valid' })
  @IsOptional()
  gender: GENDER;

  @IsPhoneNumber('VN', { message: 'Not a Vietnamese phone number' })
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  defaultAddress: string;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Address Is Required' })
  address: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Longitude Is Required' })
  longitude: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Latitude Is Required' })
  latitude: number;

  @IsString()
  @IsNotEmpty({ message: 'Full Name Is Required' })
  fullName: string;

  @IsPhoneNumber('VN', { message: 'Not a Vietnamese phone number' })
  @IsNotEmpty({ message: 'Phone number Is Required' })
  phoneNumber: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsPhoneNumber('VN', { message: 'Not a Vietnamese phone number' })
  @IsOptional()
  phoneNumber: string;
}

export class RoleDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsEnumArray(UserRole, { message: 'Invalid roles' })
  role: UserRole[];
}

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Product Id Is Required' })
  productId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product Variant Id Is Required' })
  productVariantId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity Is Required' })
  quantity: number;
}
