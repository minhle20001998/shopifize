import { Address } from "@shopifize/helpers";

export type AddAddressType = Omit<Address, "id" | "profile">;

export type UpdateAddressType = Omit<Address, "profile">;

export type PaginationType = {
  skip: number;
  limit: number;
};

export type GetProductsType = {
  category: string;
  subCategory: string;
  startPrice?: string;
  endPrice?: string;
  rating?: string;
  onSale?: string;
};

export type GetCommentsType = {
  productVariantId: string;
  rating?: string;
};

export type CreateCommentType = {
  productVariantId: string;
  comment: string;
  rating: number;
};

export type CartItemType = {
  productId: string;
  productVariantId: string;
  quantity: number;
};
