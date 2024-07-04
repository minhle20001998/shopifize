import { Paginated, Product, ResponseType } from "@shopifize/helpers"
import { UseQueryOptions, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation"
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery"
import { addProduct, deleteProduct, deleteProductVariant, getProduct, getProducts, updateProduct } from "~/utils/axios/fetch"
import { AddProductType, GetProductsType, UpdateProductType } from "~/utils/types"

export const GET_PRODUCTS_KEY = "GET_PRODUCTS_KEY"
export const GET_PRODUCT_KEY = "GET_PRODUCT_KEY"

export const useGetProductsQuery = (input: GetProductsType, options: UseQueryOptions<ResponseType<Paginated<Product[]>>, AxiosError>) => {
  const results = useShopifizedQuery([GET_PRODUCTS_KEY, input.limit, input.skip], () => {
    return getProducts(input)
  }, options)

  return results
}

export const useGetProductQuery = (id: string, options?: UseQueryOptions<ResponseType<Product>, AxiosError>) => {
  const results = useShopifizedQuery([GET_PRODUCT_KEY, id], () => {
    return getProduct(id)
  }, options)

  return results
}

export const useAddProductMutation = () => {
  return useShopifizedMutation((data: AddProductType) => {
    return addProduct(data)
  })
}

export const useUpdateProductMutation = () => {
  return useShopifizedMutation((data: UpdateProductType) => {
    return updateProduct(data)
  })
}

export const useDeleteProductMutation = () => {
  return useShopifizedMutation(({ id }: { id: string }) => {
    return deleteProduct(id)
  })
}

export const useDeleteProductVariantMutation = () => {
  return useShopifizedMutation(({ id }: { id: string }) => {
    return deleteProductVariant(id)
  })
}

export const useInvalidateProductQuery = () => {
  const queryClient = useQueryClient();

  return {
    invalidateProductQuery: async (id: string) => {
      await queryClient.invalidateQueries({
        queryKey: [GET_PRODUCT_KEY, id]
      })
    }
  }
}

