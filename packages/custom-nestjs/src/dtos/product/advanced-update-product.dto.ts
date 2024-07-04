import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ExistProductVariantDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  imgSrc: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  salePrice: number;

  @IsNumber()
  @IsOptional()
  quantity: number;
}

export class NewProductVariantDTO {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  imgSrc: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  salePrice: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class ExistVariantDTO extends ExistProductVariantDTO {
  @IsUUID()
  @IsString()
  id: string;
}

export class AdvancedUpdateProductDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  subCategoryId?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewProductVariantDTO)
  @IsOptional()
  addProductVariants?: NewProductVariantDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExistVariantDTO)
  @IsOptional()
  updateProductVariants?: ExistVariantDTO[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleteProductVariants?: string[];
}
