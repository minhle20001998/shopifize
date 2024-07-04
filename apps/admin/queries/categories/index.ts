import { Category, Paginated, ResponseType } from "@shopifize/helpers"
import { UseQueryOptions, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation"
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery"
import { addCategory, deleteCategories, deleteCategory, getCategories, getCategory, updateCategory, uploadCategories } from "~/utils/axios/fetch"
import { AddCategoryType, PaginationType, UpdateCategoryType } from "~/utils/types"

export const GET_CATEGORIES_KEY = "GET_CATEGORIES_KEY"

export const useGetCategoriesQuery = (input?: PaginationType, options?: UseQueryOptions<ResponseType<Paginated<Category[]>>, AxiosError>) => {
  const results = useShopifizedQuery([GET_CATEGORIES_KEY, input?.limit, input?.skip], () => {
    return getCategories(input)
  }, options)
  return results
}

export const useGetCategoryQuery = (id: string, options: UseQueryOptions<ResponseType<Category>, AxiosError>) => {
  const results = useShopifizedQuery([GET_CATEGORIES_KEY, id], () => {
    return getCategory(id)
  }, options)
  return results
}

export const useAddCategoryMutation = () => {
  return useShopifizedMutation((data: AddCategoryType) => {
    return addCategory(data)
  })
}

export const useUpdateCategoryMutation = () => {
  return useShopifizedMutation((data: UpdateCategoryType) => {
    return updateCategory(data)
  })
}

export const useDeleteCategoryMutation = () => {
  return useShopifizedMutation(({id}: {id: string}) => {
    return deleteCategory(id)
  })
}

export const useDeleteCategoriesMutation = () => {
  return useShopifizedMutation(({ids}: {ids: string[]}) => {
    return deleteCategories(ids)
  })
}

export const useUploadCategoriesMutation = () => {
  return useShopifizedMutation((data: FormData) => {
    return uploadCategories(data)
  })
}

export const useInvalidateCategoryQuery = () => {
  const queryClient = useQueryClient();

  return {
    invalidateCategoryQuery: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_CATEGORIES_KEY]
      })
    }
  }
}