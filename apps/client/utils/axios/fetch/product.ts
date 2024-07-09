import { AxiosError } from "axios";
import { commentClient, productClient } from "../clients";
import {
  Comment,
  Paginated,
  Product,
  removeEmptyValues,
  ResponseType,
} from "@shopifize/helpers";
import {
  CreateCommentType,
  GetCommentsType,
  GetProductsType,
  PaginationType,
} from "~/utils/types";
import QueryString from "qs";

export const getNewProducts = async () => {
  const { data } = await productClient.get<ResponseType<Product[]>>(
    "/public/new-products"
  );
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};

export const getProducts = async (query: GetProductsType) => {
  const queryString = QueryString.stringify(removeEmptyValues(query));
  const { data } = await productClient.get<ResponseType<Paginated<Product[]>>>(
    `/public/products?${queryString}`
  );

  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await productClient.get<ResponseType<Product>>(
    `/public/products/${id}`
  );
  return data;
};

export const getComments = async (query: GetCommentsType & PaginationType) => {
  const { productVariantId, ...queries } = query;
  const queryString = QueryString.stringify(removeEmptyValues(queries));
  const { data } = await productClient.get<ResponseType<Paginated<Comment[]>>>(
    `/public/comments/${productVariantId}?${queryString}`
  );

  return data;
};

export const createComment = async (commentData: CreateCommentType) => {
  const { data } = await commentClient.post<ResponseType<null>>(
    "",
    commentData
  );

  return data;
};
