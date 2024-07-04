import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name Is Required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description Is Required' })
  description: string;
}

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class CreateSubCategoryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name Is Required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description Is Required' })
  description: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Category Id Is Required' })
  categoryId: string;
}

export class UpdateSubCategoryDTO {
  @IsString()
  @IsOptional({ message: 'Name Is Required' })
  name: string;

  @IsString()
  @IsOptional({ message: 'Description Is Required' })
  description: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Category Id Is Required' })
  categoryId: string;
}
