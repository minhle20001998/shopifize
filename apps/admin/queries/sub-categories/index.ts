import { ResponseType, SubCategory } from "@shopifize/helpers"
import { UseQueryOptions, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation"
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery"
import { addSubCategory, deleteSubCategory, getSubCategories, getSubCategory, updateSubCategory } from "~/utils/axios/fetch"
import { AddSubCategoryType, UpdateSubCategoryType } from "~/utils/types"

export const GET_SUB_CATEGORIES_KEY = "GET_SUB_CATEGORIES_KEY"

export const useGetSubCategoriesQuery = (categoryId?: string, options?: UseQueryOptions<ResponseType<SubCategory[]>, AxiosError>) => {
  const results = useShopifizedQuery([GET_SUB_CATEGORIES_KEY, categoryId], () => {
    return getSubCategories({categoryId})
  }, options)
  return results
}

export const useGetSubCategoryQuery = (id: string, options?: UseQueryOptions<ResponseType<SubCategory>, AxiosError>) => {
  const results = useShopifizedQuery([GET_SUB_CATEGORIES_KEY, id], () => {
    return getSubCategory(id)
  }, options)
  return results
}

export const useAddSubCategoryMutation = () => {
  return useShopifizedMutation((data: AddSubCategoryType) => {
    return addSubCategory(data)
  })
}

export const useUpdateSubCategoryMutation = () => {
  return useShopifizedMutation((data: UpdateSubCategoryType) => {
    return updateSubCategory(data)
  })
}

export const useDeleteSubCategoryMutation = () => {
  return useShopifizedMutation(({id}: {id: string}) => {
    return deleteSubCategory(id)
  } )
}

export const useInvalidateSubCategoryQuery = (categoryId?: string) => {
  const queryClient = useQueryClient();

  return {
    invalidateSubCategoryQuery: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_SUB_CATEGORIES_KEY, categoryId]
      })
    }
  }
}