import { Inject, Injectable } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  CreateCommentDTO,
  PaginationDto,
  UpdateCommentDTO,
} from '@shopifize/custom-nestjs';
import { Comment, Repository, User, UserRole } from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';
import { CommentPagination } from 'src/helpers/types';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private CommentDatabase: Repository<Comment>,
  ) {}

  async getComments(pagination: PaginationDto<CommentPagination>) {
    const [comments, count] = await this.CommentDatabase.findAndCount({
      where: {
        product: {
          id: pagination.search.productId,
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
      product: {
        id: comment.productId,
      },
      user: {
        id: comment.userId,
      },
    });

    await this.CommentDatabase.save(commentInstance);
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
