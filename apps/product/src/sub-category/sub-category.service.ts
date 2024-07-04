import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  CreateSubCategoryDTO,
  SUB_CATEGORY_REPOSITORY,
  UpdateSubCategoryDTO,
} from '@shopifize/custom-nestjs';
import { Category, Repository, SubCategory } from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';

@Injectable()
export class SubCategoryService {
  constructor(
    @Inject(SUB_CATEGORY_REPOSITORY)
    private SubCategoryDatabase: Repository<SubCategory>,
    @Inject(CATEGORY_REPOSITORY)
    private CategoryDatabase: Repository<Category>,
  ) {}

  ping() {
    return 'pong';
  }

  async getAllSubCategories(options?: {
    category?: string;
    categoryName?: string;
  }) {
    const subCategories = await this.SubCategoryDatabase.find({
      relations: { category: true },
      where: {
        category: {
          id: options.category,
          name: options.categoryName,
        },
      },
    });
    return subCategories;
  }

  async getSubCategory(id: string) {
    const category = await this.SubCategoryDatabase.findOne({
      where: { id: id },
      relations: { category: true },
    });
    return category;
  }

  async createSubCategory(subCategory: CreateSubCategoryDTO) {
    const category = await this.verifyCategory(subCategory.categoryId);
    const subCategoryInstance = this.SubCategoryDatabase.create({
      ...subCategory,
      category: category,
    });
    await this.SubCategoryDatabase.save(subCategoryInstance);
  }

  async updateSubCategory(id: string, subCategory: UpdateSubCategoryDTO) {
    const category = await this.verifyCategory(subCategory.categoryId);
    let subCategoryInstance = await this.getSubCategory(id);
    subCategoryInstance = { ...subCategoryInstance, ...subCategory, category };
    await this.SubCategoryDatabase.save(subCategoryInstance);
  }

  async deleteSubCategory(id: string) {
    const categoryInstance = await this.getSubCategory(id);
    await this.SubCategoryDatabase.remove(categoryInstance);
  }

  async verifyCategory(id: string) {
    const category = await this.CategoryDatabase.findOne({ where: { id: id } });
    if (!category) {
      throw new ShopifizedError('Category not found');
    }
    return category;
  }
}
