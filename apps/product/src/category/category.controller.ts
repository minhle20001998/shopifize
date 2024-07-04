import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  Pagination,
  PaginationDto,
  UpdateCategoryDTO,
} from '@shopifize/custom-nestjs';
import { generateResponse, generateUniqueFileName } from '@shopifize/helpers';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UPLOAD_FILE_DESTINATION } from 'src/helpers/constants';

const PaginationGetCategories = Pagination<null>();

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('ping')
  ping() {
    return this.categoryService.ping();
  }

  @Get()
  async getCategories(
    @PaginationGetCategories() pagination: PaginationDto<null>,
  ) {
    const categories = await this.categoryService.getAllCategories(pagination);
    return generateResponse(categories, true);
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const category = await this.categoryService.getCategory(id);
    return generateResponse(category, true);
  }

  @Post()
  async createCategory(@Body() category: CreateCategoryDTO) {
    await this.categoryService.createCategory(category);
    return generateResponse(true, true);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDTO,
  ) {
    await this.categoryService.updateCategory(id, category);
    return generateResponse(true, true);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
    return generateResponse(true, true);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_FILE_DESTINATION,
        filename(_, file, callback) {
          callback(null, generateUniqueFileName(file.originalname));
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFile() file: Express.Multer.File) {
    // save the file to somewhere else and after that -> handle the logic
    const result = await this.categoryService.createCategoriesFromJSON(file);
    return generateResponse(result);
  }

  @Post('delete-many')
  async deleteMany(@Body('ids') ids: string[]) {
    const rejectReasons = await this.categoryService.deleteCategories(ids);
    return generateResponse(rejectReasons);
  }
}
