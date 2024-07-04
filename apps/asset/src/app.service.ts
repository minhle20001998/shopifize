import { Injectable } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { EnvService } from '@shopifize/custom-nestjs';
import { Env } from './helpers/types';
import { BucketObject, isImage, truncate } from '@shopifize/helpers';

@Injectable()
export class AppService {
  private client: S3Client;

  constructor(private readonly env: EnvService<Env>) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: env.get('s3.aws_access_key'),
        secretAccessKey: env.get('s3.aws_secret_key'),
      },
      region: env.get('s3.bucket_region'),
    });
  }

  async getBuckets() {
    const command = new ListBucketsCommand({});

    const { Buckets } = await this.client.send(command);
    return Buckets;
  }

  async getObjects(folderPrefix?: string) {
    const getObjectCommand = new ListObjectsV2Command({
      Bucket: this.env.get('s3.bucket'),
      Delimiter: '/',
      Prefix: folderPrefix !== '/' ? folderPrefix : '',
    });

    const response = await this.client.send(getObjectCommand);

    const chonkyFiles: BucketObject[] = [];
    const s3Objects = response.Contents;
    const s3Prefixes = response.CommonPrefixes;

    if (s3Objects) {
      const imageObjects: BucketObject[] = [];
      for (let i = 0; i < s3Objects.length; i++) {
        const object = s3Objects[i];
        const isFileImage = isImage(object.Key);
        if (isFileImage) {
          imageObjects.push({
            id: object.Key,
            isDir: false,
            name: truncate(this.extractLastFolder(object.Key), 10),
            originalName: object.Key,
            modDate: object.LastModified,
            thumbnailUrl: `${this.env.get('s3.bucket_endpoint')}/${object.Key}`,
            size: object.Size,
            downloadUrl: `${this.env.get('s3.bucket_endpoint')}/${object.Key}`,
          });
        }
      }
      chonkyFiles.push(...imageObjects);
    }

    if (s3Prefixes) {
      chonkyFiles.push(
        ...s3Prefixes.map((prefix) => ({
          id: prefix.Prefix,
          name: truncate(this.extractLastFolder(prefix.Prefix), 10),
          originalName: this.extractLastFolder(prefix.Prefix),
          isDir: true,
        })),
      );
    }

    return chonkyFiles;
  }

  async createFolder(folderName: string, folderPrefix?: string) {
    const createFolderCommand = new PutObjectCommand({
      Bucket: this.env.get('s3.bucket'),
      Key: `${folderPrefix !== '/' ? folderPrefix : ''}${folderName}/`,
    });

    const response = await this.client.send(createFolderCommand);

    return response;
  }

  async uploadFiles(files: Array<Express.Multer.File>, folderPrefix?: string) {
    const uploadPromises = [];

    files.forEach((file) => {
      const uploadCommand = new PutObjectCommand({
        Bucket: this.env.get('s3.bucket'),
        Key: `${folderPrefix !== '/' ? folderPrefix : ''}${file.originalname}`,
        Body: file.buffer,
      });
      uploadPromises.push(this.client.send(uploadCommand));
    });

    await Promise.all(uploadPromises);

    return true;
  }

  async deleteFiles(files: string[]) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.env.get('s3.bucket'),
      Delete: {
        Objects: files.map((file) => {
          return { Key: file };
        }),
      },
    });

    await this.client.send(deleteCommand);
  }

  extractLastFolder(path: string) {
    // Remove trailing slashes and split the path by '/'
    const pathSegments = path.replace(/\/+$/, '').split('/');

    // Extract the last element from the array
    const lastFolder = pathSegments[pathSegments.length - 1];

    return lastFolder;
  }
}
