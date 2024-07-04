import { Category, Paginated, removeEmptyValues, ResponseType } from "@shopifize/helpers"
import { categoryClient } from "../clients"
import { AxiosError } from "axios";
import { AddCategoryType, PaginationType, UpdateCategoryType } from "~/utils/types";
import qs from 'qs'

export const getCategories = async (input?: PaginationType) => {
  const query = input ? qs.stringify(removeEmptyValues(input)) : ''
  const { data } = await categoryClient.get<ResponseType<Paginated<Category[]>>>(`/category?${query}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
}

export const getCategory = async (id: string) => {
  const { data } = await categoryClient.get<ResponseType<Category>>(`/category/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const addCategory = async (input: AddCategoryType) => {
  const { data } = await categoryClient.post<ResponseType<null>>('/category', input)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const updateCategory = async (input: UpdateCategoryType) => {
  const { id, ...categoryData } = input
  const { data } = await categoryClient.patch<ResponseType<null>>(`/category/${id}`, categoryData)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const deleteCategory = async (id: string) => {
  const { data } = await categoryClient.delete<ResponseType<null>>(`/category/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const deleteCategories = async (ids: string[]) => {
  const { data } = await categoryClient.post<ResponseType<null>>(`/category/delete-many`, { ids })
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const uploadCategories = async (formData: FormData) => {
  const { data } = await categoryClient.post('/category/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}