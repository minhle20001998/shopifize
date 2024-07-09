import { Inject, Injectable } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  CreateCommentDTO,
  PaginationDto,
  UpdateCommentDTO,
} from '@shopifize/custom-nestjs';
import { Comment, Repository, User, UserRole } from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';
import { AppService } from 'src/app.service';
import { CommentPagination } from 'src/helpers/types';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private CommentDatabase: Repository<Comment>,
    private readonly appService: AppService,
  ) {}

  async getComments(pagination: PaginationDto<CommentPagination>) {
    const [comments, count] = await this.CommentDatabase.findAndCount({
      where: {
        product_variant: {
          id: pagination.search.productVariantId,
        },
        user: {
          id: pagination.search.userId,
        },
        rating: pagination.search.rating,
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    return {
      data: comments,
      total: count,
      skip: pagination.skip,
      limit: pagination.limit,
    };
  }

  async createComment(comment: CreateCommentDTO & { userId: string }) {
    const commentInstance = this.CommentDatabase.create({
      ...comment,
      product_variant: {
        id: comment.productVariantId,
      },
      user: {
        id: comment.userId,
      },
    });

    await this.CommentDatabase.save(commentInstance);
    await this.appService.addStarsToProductStatus(
      comment.productVariantId,
      comment.rating,
    );
  }

  async updateComment(id: string, updateComment: UpdateCommentDTO) {
    await this.CommentDatabase.update(id, {
      comment: updateComment.comment,
      rating: updateComment.rating,
    });
  }

  async deleteComment(id: string) {
    const commentInstance = await this.CommentDatabase.findOne({
      where: { id },
    });

    if (!commentInstance) {
      throw new ShopifizedError(`Comment ${id} does not exist`);
    }

    await this.CommentDatabase.remove(commentInstance);
  }

  checkDeletionAuthority(id: string, user: User) {
    if (user.roles.map((role) => role.role).includes(UserRole.ADMIN)) {
      return true;
    }

    return user.id === id;
  }
}
