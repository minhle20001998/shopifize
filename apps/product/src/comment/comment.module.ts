import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { EntityModule } from '@shopifize/custom-nestjs';

@Module({
  imports: [EntityModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
