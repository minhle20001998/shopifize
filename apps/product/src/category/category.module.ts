import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { EntityModule } from '@shopifize/custom-nestjs';
import { MulterModule } from '@nestjs/platform-express';
import { UPLOAD_FILE_DESTINATION } from 'src/helpers/constants';

@Module({
  imports: [
    EntityModule,
    MulterModule.register({
      dest: UPLOAD_FILE_DESTINATION,
    }),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
