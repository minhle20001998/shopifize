import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/decorators/boolean.transform.decorator';

export class GetTopViewdProductDTO {
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class GetNewProductsDTO {
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class GetProductsDTO {
  @IsString()
  category: string;

  @IsString()
  subCategory: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startPrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endPrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rating?: number;

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  onSale?: boolean;
}
