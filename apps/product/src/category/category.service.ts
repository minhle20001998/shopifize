import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  CreateCategoryDTO,
  EnvService,
  PaginationDto,
  SUB_CATEGORY_REPOSITORY,
  UpdateCategoryDTO,
} from '@shopifize/custom-nestjs';
import { Category, Repository, SubCategory } from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';
import { createReadStream } from 'fs';
import { Redis } from 'ioredis';
import { RedisKey } from 'src/helpers/constants';
import {
  CategoriesFileUpload,
  CategoriesFileUploadSchema,
} from 'src/helpers/schemas';
import { Env } from 'src/helpers/types';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private CategoryDatabase: Repository<Category>,
    @Inject(SUB_CATEGORY_REPOSITORY)
    private SubCategoryDatabase: Repository<SubCategory>,
    private readonly env: EnvService<Env>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  ping() {
    return 'pong';
  }

  async getAllCategories(pagination: PaginationDto<null>) {
    if (pagination.limit == null && pagination.skip === 0) {
      const cachedCategories = await this.getCategoriesFromCache();
      if (cachedCategories) {
        return cachedCategories;
      } else {
        return await this.setCategoriesToCache();
      }
    }
    const [categories, count] = await this.CategoryDatabase.findAndCount({
      relations: { subCategory: true },
      take: pagination.limit,
      skip: pagination.skip,
    });
    return {
      data: categories,
      total: count,
      skip: pagination.skip,
      limit: pagination.limit ?? -1,
    };
  }

  async getCategory(id: string) {
    const category = await this.CategoryDatabase.findOne({
      where: { id: id },
      relations: { subCategory: true },
    });
    return category;
  }

  async createCategory(category: CreateCategoryDTO) {
    const categoryInstance = this.CategoryDatabase.create(category);

    await this.CategoryDatabase.save(categoryInstance);

    await this.setCategoriesToCache();
  }

  async updateCategory(id: string, category: UpdateCategoryDTO) {
    let categoryInstance = await this.getCategory(id);
    categoryInstance = { ...categoryInstance, ...category };
    await this.CategoryDatabase.save(categoryInstance);
    await this.setCategoriesToCache();
  }

  async deleteCategory(id: string) {
    const categoryInstance = await this.getCategory(id);
    if (!categoryInstance) {
      throw new ShopifizedError(`Category ${id} does not exist`);
    }
    for (let i = 0; i < categoryInstance.subCategory.length; i++) {
      if (categoryInstance.subCategory) {
        //TODO: promise all & transaction
        await this.SubCategoryDatabase.remove(categoryInstance.subCategory[i]);
      }
    }
    await this.CategoryDatabase.remove(categoryInstance);
    await this.setCategoriesToCache();
    return null;
  }

  async deleteCategories(ids: string[]) {
    const promises: Promise<null>[] = [];
    ids.forEach((id) => {
      promises.push(this.deleteCategory(id));
    });

    const isRejected = <T>(
      p: PromiseSettledResult<T>,
    ): p is PromiseRejectedResult => p.status === 'rejected';

    const results = await Promise.allSettled(promises);

    const rejectedReasons = results
      .filter(isRejected)
      .map((p) => (p.reason as Error).message);
    return rejectedReasons;
  }

  async createCategoriesFromJSON(file: Express.Multer.File) {
    const readStream = createReadStream(file.path, { encoding: 'utf-8' });
    const jsonStream = readStream.pipe(parser()).pipe(streamArray());
    let records: CategoriesFileUpload[] = [];
    return new Promise((resolve, reject) => {
      jsonStream.on('data', async (data: { value: CategoriesFileUpload }) => {
        const value = data.value;
        try {
          const validatedValue = CategoriesFileUploadSchema.parse(
            value,
          ) as CategoriesFileUpload;
          records.push(validatedValue);
          if (records.length === this.env.get('json_objects_per_execution')) {
            for (let i = 0; i < records.length; i++) {
              const currentValue = records[i];
              this.createCategoryAndSubCategories(currentValue);
            }
            records = [];
          }
        } catch (e) {
          reject(e.message);
        }
      });

      jsonStream.on('end', () => {
        const promises: Promise<SubCategory[]>[] = [];
        for (let i = 0; i < records.length; i++) {
          const currentValue = records[i];
          promises.push(this.createCategoryAndSubCategories(currentValue));
        }
        records = [];
        Promise.all(promises).then(() => {
          resolve(true);
        });
      });

      jsonStream.on('error', (err) => {
        reject(err.message);
      });
    }).catch((error) => {
      throw new ShopifizedError(error);
    });
  }

  async createCategoryAndSubCategories(value: CategoriesFileUpload) {
    const currentValue = value;
    const categoryInstance = this.CategoryDatabase.create({
      name: currentValue.category_name,
      description: currentValue.category_description,
    });
    await this.CategoryDatabase.save(categoryInstance);
    const subCategoryInstances = currentValue.sub_categories.map(
      (subCategory) => {
        return this.SubCategoryDatabase.create({
          description: subCategory.sub_category_description,
          name: subCategory.sub_category_name,
          category: categoryInstance,
        });
      },
    );
    return this.SubCategoryDatabase.save(subCategoryInstances);
  }

  async getCategoriesFromCache() {
    const result = await this.redis.get(`${RedisKey.CATEGORIES}`);

    return JSON.parse(result);
  }

  async setCategoriesToCache() {
    const [categories, count] = await this.CategoryDatabase.findAndCount({
      relations: { subCategory: true },
    });
    const result = {
      data: categories,
      total: count,
      skip: 0,
      limit: -1,
    };
    await this.redis.set(`${RedisKey.CATEGORIES}`, JSON.stringify(result));

    return await this.getCategoriesFromCache();
  }
}
