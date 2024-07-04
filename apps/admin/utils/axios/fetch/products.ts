import { AddProductType, GetProductsType, UpdateProductType } from "~/utils/types"
import qs from 'qs'
import { Paginated, Product, ResponseType, removeEmptyValues } from "@shopifize/helpers"
import { productClient } from "../clients"
import { AxiosError } from "axios"

export const getProducts = async (input: GetProductsType) => {
  const query = input ? qs.stringify(removeEmptyValues(input)) : ''
  const { data } = await productClient.get<ResponseType<Paginated<Product[]>>>(`/products?${query}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const getProduct = async (id: string) => {
  const { data } = await productClient.get<ResponseType<Product>>(`/products/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data;
}

export const addProduct = async (input: AddProductType) => {
  const { data } = await productClient.post<ResponseType<unknown>>('/products', input)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const updateProduct = async (input: UpdateProductType) => {
  const { id, ...product } = input
  const { data } = await productClient.patch<ResponseType<unknown>>(`/product/${id}`, product)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const deleteProduct = async (id: string) => {
  const { data } = await productClient.delete<ResponseType<null>>(`/products/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const deleteProductVariant = async (id: string) => {
  const { data } = await productClient.delete<ResponseType<null>>(`products/variant/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}