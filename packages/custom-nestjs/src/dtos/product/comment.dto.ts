import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty({ message: 'Comment Is Required' })
  comment: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Comment Is Required' })
  @Type(() => Number)
  rating: number;

  @IsUUID()
  @IsNotEmpty({ message: 'Product Variant Id Is Required' })
  productVariantId: string;
}

export class UpdateCommentDTO {
  @IsString()
  @IsOptional()
  comment: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rating: number;
}
