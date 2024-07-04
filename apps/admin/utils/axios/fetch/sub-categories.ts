import qs from "qs"
import { subCategoryClient } from "../clients"
import { ResponseType, SubCategory } from "@shopifize/helpers"
import { AxiosError } from "axios"
import { AddSubCategoryType, UpdateSubCategoryType } from "~/utils/types"

export const getSubCategories = async ({ categoryId }: { categoryId?: string }) => {
  const query = qs.stringify({ category: categoryId }, { skipNulls: true })
  const { data } = await subCategoryClient.get<ResponseType<SubCategory[]>>(`/sub-category?${query}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const getSubCategory = async (id: string) => {
  const { data } = await subCategoryClient.get<ResponseType<SubCategory>>(`/sub-category/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const addSubCategory = async (input: AddSubCategoryType) => {
  const { data } = await subCategoryClient.post<ResponseType<null>>(`/sub-category`, input)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const updateSubCategory = async (input: UpdateSubCategoryType) => {
  const { id, ...subCategory } = input;
  const { data } = await subCategoryClient.patch<ResponseType<null>>(`/sub-category/${id}`, subCategory)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const deleteSubCategory = async (id: string) => {
  const { data } = await subCategoryClient.delete<ResponseType<null>>(`/sub-category/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}