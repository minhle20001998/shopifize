/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrderBy } from '@shopifize/helpers';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export * from './auth';
export * from './user';
export * from './product';
export * from './order';

export class UUIDDto {
  @IsUUID()
  id: string;
}

@ValidatorConstraint({ name: 'isValidOrder', async: false })
export class IsValidOrder implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return value === 'asc' || value === 'desc';
  }

  defaultMessage(args: ValidationArguments) {
    return 'The order must be either "asc" or "desc".';
  }
}

export class PaginationDto<T> {
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  @Matches(
    `^${Object.values(OrderBy)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  orderBy?: OrderBy;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value ? { [value]: true } : {};
  })
  sortBy?: Record<string, string>;

  @IsOptional()
  @IsString()
  search?: T;
}
