export type AddCategoryType = {
  name: string
  description: string
}

export type UpdateCategoryType = Partial<AddCategoryType> & { id: string }

export type AddSubCategoryType = AddCategoryType & {
  categoryId: string
}

export type UpdateSubCategoryType = Partial<AddCategoryType> & {
  categoryId: string
  id: string
}

export type GetProductsType = {
  name?: string
  categoryId?: string
  subCategoryId?: string[]
} & PaginationType

export type AddProductType = {
  name: string
  categoryId: string
  description: string
  subCategoryId: string[]
  productVariants: {
    id?: string
    description: string
    color: string
    imgSrc: string
    quantity: number
    price: number
    salePrice?: number | null
  }[]
}

export type UpdateProductType = {
  name?: string
  categoryId?: string
  description?: string
  subCategoryId?: string[]
  addProductVariants?: {
    description: string
    color: string
    imgSrc: string
    quantity: number
    price: number
    salePrice?: number | null
  }[]
  updateProductVariants?: {
    id: string
    description?: string
    color?: string
    imgSrc?: string
    quantity?: number
    price?: number
    salePrice?: number
  }[],
  deleteProductVariants?: string[]
} & { id: string }

export type CreateAssetFolderType = {
  folderName: string
  folderPrefix?: string
}

export type UploadAssetType = {
  folderPrefix: string
  formData: FormData
}

export type DeleteAssetObjectType = {
  paths: string[]
}

export type PaginationType = {
  skip: number
  limit: number
}