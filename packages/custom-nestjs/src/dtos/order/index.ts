import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  cartItemIds: string[];
}
