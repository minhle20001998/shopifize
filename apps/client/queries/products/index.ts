import { Comment, Paginated, Product, ResponseType } from "@shopifize/helpers";
import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import {
  createComment,
  CreateCommentType,
  getComments,
  GetCommentsType,
  getNewProducts,
  getProduct,
  getProducts,
  GetProductsType,
  PaginationType,
} from "~/utils";

export const GET_NEW_PRODUCTS = "GET_NEW_PRODUCTS";
export const GET_PRODUCTS = "GET_PRODUCTS";
export const GET_COMMENTS = "GET_COMMENTS";

export const useGetNewProductsQuery = () => {
  const results = useShopifizedQuery([GET_NEW_PRODUCTS], getNewProducts);

  return results;
};

export const useGetProductsQuery = (
  query: GetProductsType,
  options?: UseQueryOptions<ResponseType<Paginated<Product[]>>, AxiosError>
) => {
  const results = useShopifizedQuery(
    [GET_PRODUCTS, query],
    () => {
      return new Promise<ResponseType<Paginated<Product[]>>>(
        (resolve, reject) => {
          setTimeout(() => {
            getProducts(query)
              .then((data) => resolve(data))
              .catch((e) => reject(e));
          }, 500);
        }
      );
    },
    options
  );

  return results;
};

export const useGetProductQuery = (
  id: string,
  options?: UseQueryOptions<ResponseType<Product>, AxiosError>
) => {
  const results = useShopifizedQuery<ResponseType<Product>>(
    [GET_PRODUCTS, id],
    () => {
      return getProduct(id);
    },
    options
  );
  return results;
};

export const useGetCommentsQuery = (
  { productId, rating, limit, skip }: GetCommentsType & PaginationType,
  options?: UseQueryOptions<ResponseType<Paginated<Comment[]>>, AxiosError>
) => {
  const results = useShopifizedQuery<ResponseType<Paginated<Comment[]>>>(
    [GET_COMMENTS, productId, rating, limit, skip],
    () => {
      return getComments({ productId, rating, limit, skip });
    },
    options
  );

  return results;
};

export const useCreateCommentMutation = (
  options?: UseQueryOptions<ResponseType<null>, AxiosError>
) => {
  const result = useShopifizedMutation((data: CreateCommentType) => {
    return createComment(data);
  }, options);

  return result;
};
