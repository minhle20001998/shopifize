/* eslint-disable @typescript-eslint/no-unused-vars */
//TODO: rework product status
import { Inject, Injectable } from '@nestjs/common';
import {
  AdvancedUpdateProductDTO,
  CATEGORY_REPOSITORY,
  CreateProductDTO,
  CreateProductVariantDTO,
  PRODUCT_REPOSITORY,
  PRODUCT_STATUS_REPOSITORY,
  PRODUCT_VARIANT_REPOSITORY,
  PaginationDto,
  SUB_CATEGORY_REPOSITORY,
  UpdateProductDTO,
} from '@shopifize/custom-nestjs';
import Database, {
  Repository,
  Product,
  Category,
  ProductVariant,
  ProductStatus,
  SubCategory,
  Like,
} from '@shopifize/database';
import { ShopifizedError, isNil } from '@shopifize/helpers';
import { ProductPaginationSearch } from './helpers/types';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { RedisKey } from './helpers/constants';
@Injectable()
export class AppService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private ProductDatabase: Repository<Product>,
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private ProductVariantDatabase: Repository<ProductVariant>,
    @Inject(PRODUCT_STATUS_REPOSITORY)
    private ProductStatusDatabase: Repository<ProductStatus>,
    @Inject(SUB_CATEGORY_REPOSITORY)
    private SubCategoryDatabase: Repository<SubCategory>,
    @Inject(CATEGORY_REPOSITORY)
    private CategoryDatabase: Repository<Category>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  ping(): string {
    return 'pong';
  }

  async getProducts(pagination: PaginationDto<ProductPaginationSearch>) {
    const [products, count] = await this.ProductDatabase.findAndCount({
      where: {
        name: Like(`%${pagination.search.name ?? ''}%`),
        category: {
          id: pagination.search.categoryId,
        },
        subCategory: pagination.search.subCategoryId?.map((subCategoryId) => {
          return { id: subCategoryId };
        }),
      },
      relations: {
        category: true,
        subCategory: true,
        productVariants: {
          productStatus: true,
        },
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    return {
      data: products,
      total: count,
      skip: pagination.skip,
      limit: pagination.limit,
    };
  }

  async getProductById(id: string) {
    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      return JSON.parse(productById);
    } else {
      const productByIdInDb = await this.ProductDatabase.findOne({
        where: { id: id },
        relations: {
          category: true,
          subCategory: true,
          productVariants: {
            productStatus: true,
          },
        },
      });

      if (productByIdInDb) {
        await this.redis.set(
          `${RedisKey.PRODUCT_BY_ID}-${id}`,
          JSON.stringify(productByIdInDb),
          'EX',
          3600,
        );
      }

      return productByIdInDb;
    }
  }

  async createProduct(productDetail: CreateProductDTO) {
    const subCategory = await this.verifySubCategories(
      productDetail.subCategoryId,
    );
    const category = await this.verifyCategory(productDetail.categoryId);
    const variants = [];

    for (let i = 0; i < productDetail.productVariants.length; i++) {
      const variant = productDetail.productVariants[i];

      const statusInstance = this.ProductStatusDatabase.create({
        quantity: variant.quantity,
        rating: 0,
        sold: 0,
        stars: '0',
      });

      await this.ProductStatusDatabase.save(statusInstance);

      const variantInstance = this.ProductVariantDatabase.create({
        color: variant.color,
        description: variant.description,
        imgSrc: variant.imgSrc,
        price: variant.price,
        salePrice: variant.salePrice,
        productStatus: statusInstance,
      });

      await this.ProductVariantDatabase.save(variantInstance);

      variants.push(variantInstance);
    }
    const product = this.ProductDatabase.create({
      name: productDetail.name,
      description: productDetail.description,
      category: category,
      subCategory: subCategory,
      productVariants: variants,
    });
    await this.ProductDatabase.save(product);
  }

  async updateProduct(id: string, productDetail: UpdateProductDTO) {
    const foundProduct = await this.ProductDatabase.findOne({
      where: { id: id },
    });

    foundProduct.name = productDetail.name;

    const subCategory = await this.verifySubCategories(
      productDetail.subCategoryId,
    );

    const category = await this.verifyCategory(productDetail.categoryId);

    const promises = [];

    productDetail.productVariants.forEach((variant) => {
      if (variant.id) {
        promises.push(this.updateVariant(variant.id, variant));
      } else {
        promises.push(this.addVariant(id, variant));
      }
    });

    await Promise.all(promises);

    await this.ProductDatabase.save({
      id,
      name: productDetail.name,
      description: productDetail.description,
      category,
      subCategory,
    });
  }

  async updateProductv2(id: string, productDetail: AdvancedUpdateProductDTO) {
    const foundProduct = await this.ProductDatabase.findOne({
      where: { id: id },
    });
    const subCategory = await this.verifySubCategories(
      productDetail.subCategoryId,
    );

    const category = await this.verifyCategory(productDetail.categoryId);
    const addProductVariantList = productDetail.addProductVariants;
    const updateProductVariantList = productDetail.updateProductVariants;
    const deleteProductVariantList = productDetail.deleteProductVariants;

    await Database.manager.transaction(async (transactionalEntityManager) => {
      const addPromises = [];
      const deleteStatusPromises = [];
      const updatePromises = [];
      const deletePromises = [];
      //update product variant list
      for (let i = 0; i < updateProductVariantList?.length || 0; i++) {
        const { quantity, ...update } = updateProductVariantList[i];
        const productVariant = await transactionalEntityManager.findOne(
          ProductVariant,
          { where: { id: update.id }, relations: { productStatus: true } },
        );
        if (productVariant) {
          const { productStatus } = productVariant;
          if (!isNil(quantity)) {
            updatePromises.push(
              transactionalEntityManager.update(
                ProductStatus,
                {
                  id: productStatus.id,
                },
                {
                  quantity: quantity,
                },
              ),
            );
          }
        }
        updatePromises.push(
          transactionalEntityManager.update(
            ProductVariant,
            { id: update.id },
            update,
          ),
        );
      }
      //add product variant list
      for (let i = 0; i < addProductVariantList?.length || 0; i++) {
        const { quantity, ...add } = addProductVariantList[i];
        const newProductStatus = transactionalEntityManager.create(
          ProductStatus,
          {
            quantity: quantity,
            rating: 0,
            sold: 0,
            stars: '0',
          },
        );
        await transactionalEntityManager.save(newProductStatus);
        const newProductVariant = transactionalEntityManager.create(
          ProductVariant,
          {
            ...add,
            productStatus: newProductStatus,
            product: foundProduct,
          },
        );
        addPromises.push(
          transactionalEntityManager.insert(ProductVariant, newProductVariant),
        );
      }
      //delete product variant list
      for (let i = 0; i < deleteProductVariantList?.length || 0; i++) {
        const id = deleteProductVariantList[i];
        const deleteProductVariant = await transactionalEntityManager.findOne(
          ProductVariant,
          { where: { id }, relations: { productStatus: true } },
        );
        const deleteProductStatus = await transactionalEntityManager.findOne(
          ProductStatus,
          { where: { id: deleteProductVariant.productStatus.id } },
        );
        deletePromises.push(
          transactionalEntityManager.remove(deleteProductVariant),
        );
        deleteStatusPromises.push(
          transactionalEntityManager.remove(deleteProductStatus),
        );
      }
      const variantPromises = [
        ...addPromises,
        ...updatePromises,
        ...deletePromises,
      ];
      await Promise.all(deleteStatusPromises);
      await Promise.all(variantPromises);
      await transactionalEntityManager.save(Product, {
        id: id,
        name: productDetail.name,
        description: productDetail.description,
        category,
        subCategory,
      });
    });

    const productByIdInDb = await this.ProductDatabase.findOne({
      where: { id: id },
      relations: {
        category: true,
        subCategory: true,
        productVariants: {
          productStatus: true,
        },
      },
    });

    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      await this.redis.set(
        `${RedisKey.PRODUCT_BY_ID}-${id}`,
        JSON.stringify(productByIdInDb),
        'EX',
        3600,
      );
    }

    return true;
  }

  async deleteProduct(id: string) {
    const product = await this.ProductDatabase.findOne({
      where: { id: id },
      relations: { productVariants: { productStatus: true } },
    });

    for (let i = 0; i < product.productVariants.length; i++) {
      await this.deleteVariant(product.productVariants[i].id);
    }

    await this.ProductDatabase.remove(product);

    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      await this.redis.del(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    }
  }

  async addVariant(id: string, productVariant: CreateProductVariantDTO) {
    const product = await this.ProductDatabase.findOne({ where: { id: id } });
    const statusInstance = this.ProductStatusDatabase.create({
      quantity: productVariant.quantity,
      rating: 0,
      sold: 0,
      stars: '0',
    });

    await this.ProductStatusDatabase.save(statusInstance);

    const variantInstance = this.ProductVariantDatabase.create({
      color: productVariant.color,
      description: productVariant.description,
      price: productVariant.price,
      imgSrc: productVariant.imgSrc,
      salePrice: productVariant.salePrice,
      product: product,
      productStatus: statusInstance,
    });

    await this.ProductVariantDatabase.save(variantInstance);

    const productByIdInDb = await this.ProductDatabase.findOne({
      where: { id: id },
      relations: {
        category: true,
        subCategory: true,
        productVariants: {
          productStatus: true,
        },
      },
    });

    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      await this.redis.set(
        `${RedisKey.PRODUCT_BY_ID}-${id}`,
        JSON.stringify(productByIdInDb),
        'EX',
        3600,
      );
    }
  }

  async updateVariant(id: string, productVariant: CreateProductVariantDTO) {
    await this.ProductVariantDatabase.save({
      ...productVariant,
    });

    await this.ProductStatusDatabase.createQueryBuilder()
      .update(ProductStatus)
      .set({
        quantity: productVariant.quantity,
      })
      .where('productVariantId= :id', { id: id })
      .execute();

    const productByIdInDb = await this.ProductDatabase.findOne({
      where: { id: id },
      relations: {
        category: true,
        subCategory: true,
        productVariants: {
          productStatus: true,
        },
      },
    });

    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      await this.redis.set(
        `${RedisKey.PRODUCT_BY_ID}-${id}`,
        JSON.stringify(productByIdInDb),
        'EX',
        3600,
      );
    }
  }

  async deleteVariant(id: string) {
    const productVariant = await this.ProductVariantDatabase.findOne({
      where: { id: id },
      relations: { productStatus: true },
    });
    await this.ProductVariantDatabase.remove(productVariant);
    await this.ProductStatusDatabase.remove(productVariant.productStatus);

    const productByIdInDb = await this.ProductDatabase.findOne({
      where: { id: id },
      relations: {
        category: true,
        subCategory: true,
        productVariants: {
          productStatus: true,
        },
      },
    });

    const productById = await this.redis.get(`${RedisKey.PRODUCT_BY_ID}-${id}`);
    if (productById) {
      await this.redis.set(
        `${RedisKey.PRODUCT_BY_ID}-${id}`,
        JSON.stringify(productByIdInDb),
        'EX',
        3600,
      );
    }
  }

  async verifySubCategories(subCategoryIds: string[]): Promise<SubCategory[]> {
    let subCategories: SubCategory[];
    if (subCategoryIds) {
      const categoryFindingPromises = subCategoryIds.map((id) => {
        return this.SubCategoryDatabase.findOne({ where: { id } });
      });
      subCategories = await Promise.all(categoryFindingPromises).then(
        (values) => {
          values.forEach((category) => {
            if (category === null) {
              throw new ShopifizedError('Sub Category not found');
            }
          });
          return values;
        },
      );
    }

    return subCategories;
  }

  async verifyCategory(categoryId: string): Promise<Category> {
    const category = await this.CategoryDatabase.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new ShopifizedError('Category not found');
    }

    return category;
  }

  async addStarsToProductStatus(productVariantId: string, stars: number) {
    const productStatus = await this.ProductStatusDatabase.findOne({
      where: { productVariant: { id: productVariantId } },
    });

    const nextRating = productStatus.rating + 1;
    const nextStars = Number(stars) + Number(productStatus.stars);

    await this.ProductStatusDatabase.update(productStatus, {
      stars: nextStars.toString(),
      rating: nextRating,
    });
  }
}
