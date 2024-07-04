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

export class ProductVariantDTO {
  @IsUUID()
  @IsOptional()
  id: string;

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
  @IsNotEmpty({ message: 'Quantity Is Required' })
  quantity: number;
}

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
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
  @Type(() => ProductVariantDTO)
  productVariants: ProductVariantDTO[];
}
