import { GlobalEnv } from '@shopifize/custom-nestjs';

export class Env extends GlobalEnv {
  port: string;
  upload_file_destination: string;
  json_objects_per_execution: number;
}

export interface ProductPaginationSearch {
  name?: string;
  categoryId?: string;
  subCategoryId?: string[];
}

export interface CommentPagination {
  productVariantId?: string;
  userId?: string;
  rating?: number;
}
