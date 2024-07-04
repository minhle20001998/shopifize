import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { generateResponse } from '@shopifize/helpers';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('buckets')
  getBuckets() {
    return this.appService.getBuckets();
  }

  @Get('objects')
  async getObjects(@Query('prefix') prefix: string) {
    const objects = await this.appService.getObjects(prefix);
    return generateResponse(objects, true);
  }

  @Post('folder')
  async createFolder(
    @Body() body: { folderName: string; folderPrefix: string },
  ) {
    const { folderName, folderPrefix } = body;
    await this.appService.createFolder(folderName, folderPrefix);
    return generateResponse(null, true);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('prefix') prefix: string,
  ) {
    await this.appService.uploadFiles(files, prefix);
    return generateResponse(null, true);
  }

  @Post('objects/delete')
  async deleteObjects(@Body() body: { paths: string[] }) {
    const objects = await this.appService.deleteFiles(body.paths);
    return generateResponse(objects, true);
  }
}
