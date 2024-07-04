import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export * from './update-product.dto';
export * from './category.dto';
export * from './advanced-update-product.dto';
export * from './public-product.dto';
export * from './comment.dto';

export class CreateProductVariantDTO {
  @IsString()
  @IsNotEmpty({ message: 'Description Is Required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Color Is Required' })
  color: string;

  @IsString()
  @IsNotEmpty({ message: 'ImgSrc Is Required' })
  imgSrc: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price Is Required' })
  price: number;

  @IsNumber()
  @IsOptional()
  salePrice: number;

  @IsNumber()
  @IsNotEmpty({ message: 'quantity Is Required' })
  quantity: number;
}

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name Is Required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description Is Required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Category Is Required' })
  categoryId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty({ message: 'Sub Category Ids Is Required' })
  subCategoryId: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateProductVariantDTO)
  productVariants: CreateProductVariantDTO[];
}
