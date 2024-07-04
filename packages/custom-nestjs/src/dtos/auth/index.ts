import {
  IsString,
  IsEmail,
  Matches,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class SignupDto {
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

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email Is Required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password Is Required' })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh Token Is Required' })
  refreshToken: string;
}

export class ForgetPasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email Is Required' })
  email: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token Is Required' })
  token: string;

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

export class NewEmailDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email Is Required' })
  newEmail: string;
}
