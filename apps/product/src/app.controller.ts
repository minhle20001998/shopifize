import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { generateResponse } from '@shopifize/helpers';
import {
  AdvancedUpdateProductDTO,
  CreateProductDTO,
  CreateProductVariantDTO,
  JwtAuthGuard,
  Pagination,
  PaginationDto,
  Roles,
  RolesGuard,
  UpdateProductDTO,
} from '@shopifize/custom-nestjs';
import { ProductPaginationSearch } from './helpers/types';
import { UserRole } from '@shopifize/database';

const PaginationGetProducts = Pagination<ProductPaginationSearch>();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  ping(): string {
    return this.appService.ping();
  }

  @Get('products')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getProducts(
    @PaginationGetProducts({
      categoryId: true,
      name: true,
      subCategoryId: true,
    })
    pagination: PaginationDto<ProductPaginationSearch>,
  ) {
    const subCategoryId = pagination.search.subCategoryId;
    pagination.search = {
      ...pagination.search,
      subCategoryId: subCategoryId
        ? Array.isArray(subCategoryId)
          ? subCategoryId
          : [subCategoryId]
        : [],
    };
    const products = await this.appService.getProducts(pagination);
    return generateResponse(products, true);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    const product = await this.appService.getProductById(id);
    return generateResponse(product, true);
  }

  @Post('products')
  async createProduct(@Body() product: CreateProductDTO) {
    await this.appService.createProduct(product);
    return generateResponse(null, true);
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDTO,
  ) {
    await this.appService.updateProduct(id, product);
    return generateResponse(null, true);
  }

  @Patch('product/:id')
  async updateProductv2(
    @Param('id') id: string,
    @Body() product: AdvancedUpdateProductDTO,
  ) {
    await this.appService.updateProductv2(id, product);
    return generateResponse(null, true);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.appService.deleteProduct(id);
    return generateResponse(null, true);
  }

  @Post('products/:id/variant')
  async addVariant(
    @Param('id') id: string,
    @Body() productVariant: CreateProductVariantDTO,
  ) {
    await this.appService.addVariant(id, productVariant);
    return generateResponse(null, true);
  }

  @Delete('products/variant/:id')
  async removeVariant(@Param('id') id: string) {
    await this.appService.deleteVariant(id);
    return generateResponse(null, true);
  }
}
