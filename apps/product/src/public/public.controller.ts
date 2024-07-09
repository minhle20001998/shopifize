import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PublicService } from './public.service';
import { generateResponse } from '@shopifize/helpers';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  GetNewProductsDTO,
  GetProductsDTO,
  GetTopViewdProductDTO,
  Pagination,
  PaginationDto,
} from '@shopifize/custom-nestjs';
import { CommentPagination } from 'src/helpers/types';

const PaginationGetProducts = Pagination(GetProductsDTO);
const PaginationGetComments = Pagination<CommentPagination>();

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('ping')
  ping() {
    return this.publicService.ping();
  }

  @Post('view/:id')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 21600000 } })
  async viewProduct(@Param('id') id: string) {
    await this.publicService.viewProduct(id);
    return generateResponse(null, true);
  }

  @Get('top-view')
  async getTopViewedProducts(@Query() query: GetTopViewdProductDTO) {
    const products = await this.publicService.getTopViewedProducts({
      limit: query.limit ?? 10,
    });
    return generateResponse(products, true);
  }

  @Get('new-products')
  async getNewProducts(@Query() query: GetNewProductsDTO) {
    const product = await this.publicService.getNewProducts({
      limit: query.limit ?? 10,
    });
    return generateResponse(product, true);
  }

  @Get('products')
  async getProducts(
    @PaginationGetProducts({
      category: true,
      endPrice: true,
      onSale: true,
      rating: true,
      startPrice: true,
      subCategory: true,
    })
    pagination: PaginationDto<GetProductsDTO>,
  ) {
    const products = await this.publicService.getProducts(pagination);
    return generateResponse(products, true);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    const products = await this.publicService.getProductById(id);
    return generateResponse(products, true);
  }

  @Get('comments/:id')
  async getCommentByProductId(
    @Param('id') id: string,
    @PaginationGetComments({
      rating: true,
    })
    pagination: PaginationDto<Pick<CommentPagination, 'rating'>>,
  ) {
    const comments = await this.publicService.getCommentByProductVariantId(
      id,
      pagination,
    );

    return generateResponse(comments, true);
  }
}
