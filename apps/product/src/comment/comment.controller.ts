import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CreateCommentDTO,
  JwtAuthGuard,
  Pagination,
  PaginationDto,
  UpdateCommentDTO,
  UserParam,
} from '@shopifize/custom-nestjs';
import { CommentPagination } from 'src/helpers/types';
import { generateResponse } from '@shopifize/helpers';
import { User } from '@shopifize/database';

const PaginationGetComments = Pagination<CommentPagination>();

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @PaginationGetComments({
      productVariantId: true,
      rating: true,
      userId: true,
    })
    pagination: PaginationDto<CommentPagination>,
  ) {
    const comments = await this.commentService.getComments(pagination);
    return generateResponse(comments, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @UserParam() user: User,
    @Body() comment: CreateCommentDTO,
  ) {
    await this.commentService.createComment({
      ...comment,
      userId: user.id,
    });
    return generateResponse(true, true);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @UserParam() user: User,
    @Body() comment: UpdateCommentDTO,
  ) {
    const hasAuthority = this.commentService.checkDeletionAuthority(id, user);
    if (!hasAuthority) {
      throw new ForbiddenException();
    }
    await this.commentService.updateComment(id, comment);
    return generateResponse(true, true);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@UserParam() user: User, @Param('id') id: string) {
    const hasAuthority = this.commentService.checkDeletionAuthority(id, user);
    if (!hasAuthority) {
      throw new ForbiddenException();
    }
    await this.commentService.deleteComment(id);
    return generateResponse(true, true);
  }
}
