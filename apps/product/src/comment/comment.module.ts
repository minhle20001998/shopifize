import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { EntityModule } from '@shopifize/custom-nestjs';
import { AppService } from 'src/app.service';

@Module({
  imports: [EntityModule],
  controllers: [CommentController],
  providers: [CommentService, AppService],
})
export class CommentModule {}
