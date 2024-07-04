import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { generateResponse } from '@shopifize/helpers';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from '@shopifize/custom-nestjs';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get('ping')
  ping() {
    return this.subCategoryService.ping();
  }

  @Get()
  async getCategories(
    @Query('category') category: string,
    @Query('categoryName') categoryName: string,
  ) {
    const subCategories = await this.subCategoryService.getAllSubCategories({
      category,
      categoryName,
    });
    return generateResponse(subCategories, true);
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const category = await this.subCategoryService.getSubCategory(id);
    return generateResponse(category, true);
  }

  @Post()
  async createCategory(@Body() subCategory: CreateSubCategoryDTO) {
    await this.subCategoryService.createSubCategory(subCategory);
    return generateResponse(true, true);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateSubCategoryDTO,
  ) {
    await this.subCategoryService.updateSubCategory(id, category);
    return generateResponse(true, true);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.subCategoryService.deleteSubCategory(id);
    return generateResponse(true, true);
  }
}
