import { RequiredProperties } from '@shopifize/helpers';
import { z } from 'zod';

export const CategoriesFileUploadSchema = z.object({
  category_name: z.string(),
  category_description: z.string(),
  sub_categories: z.array(
    z.object({
      sub_category_name: z.string(),
      sub_category_description: z.string(),
    }),
  ),
});

export type CategoriesFileUpload = RequiredProperties<
  z.infer<typeof CategoriesFileUploadSchema>
>;
