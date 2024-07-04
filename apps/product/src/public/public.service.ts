import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  GetProductsDTO,
  PaginationDto,
  PRODUCT_REPOSITORY,
  RANKING_REPOSITORY,
} from '@shopifize/custom-nestjs';
import {
  Between,
  Comment,
  IsNull,
  MoreThanOrEqual,
  Not,
  Product,
  Ranking,
  Repository,
} from '@shopifize/database';
import { isNil, ShopifizedError } from '@shopifize/helpers';
import { Redis } from 'ioredis';
import { RedisKey } from 'src/helpers/constants';
import { CommentPagination } from 'src/helpers/types';

@Injectable()
export class PublicService {
  constructor(
    @Inject(RANKING_REPOSITORY)
    private RankingDatabase: Repository<Ranking>,
    @Inject(PRODUCT_REPOSITORY)
    private ProductDatabase: Repository<Product>,
    @Inject(COMMENT_REPOSITORY)
    private CommentDatabase: Repository<Comment>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  ping() {
    return 'pong';
  }

  async viewProduct(productId: string) {
    try {
      const product = await this.ProductDatabase.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new ShopifizedError('Product not found');
      }

      const isRankingExist = await this.RankingDatabase.findOne({
        where: { product: product },
      });

      if (isRankingExist) {
        await this.RankingDatabase.createQueryBuilder()
          .update()
          .where('id = :id', { id: isRankingExist.id })
          .set({ view_count: () => 'view_count + 1' })
          .execute();
      } else {
        const RankingProductInstance = this.RankingDatabase.create({
          product,
          view_count: 1,
        });

        await this.RankingDatabase.save(RankingProductInstance);
      }
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
  }

  async getTopViewedProducts({ limit }: { limit: number }) {
    try {
      const products = await this.RankingDatabase.find({
        order: { view_count: { direction: 'desc' } },
        take: limit,
      });

      return products;
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
  }

  async getNewProducts({ limit }: { limit: number }) {
    try {
      const products = await this.ProductDatabase.find({
        order: {
          created_at: { direction: 'DESC' },
        },
        take: limit,
        relations: {
          category: true,
          productVariants: {
            productStatus: true,
          },
        },
      });

      return products;
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
  }

  async getProducts({ search, limit, skip }: PaginationDto<GetProductsDTO>) {
    const { category, subCategory, startPrice, endPrice, onSale, rating } =
      search;
    try {
      const priceQuery =
        !isNil(startPrice) && !isNil(endPrice)
          ? { price: Between(startPrice, endPrice) }
          : {};

      const onSaleQuery = onSale
        ? {
            salePrice: Not(IsNull()),
          }
        : {};

      const ratingQuery = !isNil(rating)
        ? {
            rating: MoreThanOrEqual(rating),
          }
        : {};

      const [products, count] = await this.ProductDatabase.findAndCount({
        where: {
          category: {
            name: category,
          },
          subCategory: {
            name: subCategory,
          },
          productVariants: {
            ...priceQuery,
            ...onSaleQuery,
            productStatus: {
              ...ratingQuery,
            },
          },
        },
        relations: {
          category: true,
          productVariants: {
            productStatus: true,
          },
        },
        take: limit,
        skip: skip,
      });
      return {
        data: products,
        total: count,
        skip: skip,
        limit: limit,
      };
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
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

  async getCommentByProductId(
    productId: string,
    pagination: PaginationDto<Pick<CommentPagination, 'rating'>>,
  ) {
    try {
      const [comments, count] = await this.CommentDatabase.findAndCount({
        where: {
          product: {
            id: productId,
          },
          rating: pagination.search.rating,
        },
        relations: {
          user: {
            profile: true,
          },
        },
        take: pagination.limit,
        skip: pagination.skip,
      });

      return {
        data: comments.map((comment) => {
          const { user, ...userTakenComment } = comment;
          return {
            ...userTakenComment,
            user: {
              profile: {
                username: user.profile.username,
              },
            },
          };
        }),
        total: count,
        skip: pagination.skip,
        limit: pagination.limit,
      };
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
  }
}
