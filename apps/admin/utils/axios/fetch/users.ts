import { Paginated, ResponseType, Role, User, UserRole, removeEmptyValues } from "@shopifize/helpers"
import { userClient } from "../clients"
import { AxiosError } from "axios"
import { PaginationType } from "~/utils/types"
import qs from 'qs'

export const getUsers = async (input: PaginationType) => {
  const query = input ? qs.stringify(removeEmptyValues(input)) : ''
  const { data } = await userClient.get<ResponseType<Paginated<User[]>>>(`/users?${query}`)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const getRoles = async () => {
  const { data } = await userClient.get<ResponseType<UserRole[]>>('/roles')
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const getUser = async (id: string) => {
  const { data } = await userClient.get<ResponseType<User>>(`/user/${id}`)
  if (data.error) {
    throw new AxiosError(data.error.message)
  }
  return data
}

export const updateRole = async (userId: string, roles: UserRole[]) => {
  const { data } = await userClient.put<ResponseType<Role>>(`/role/${userId}`, { role: roles })
  if (data.error) {
    throw new AxiosError(data.error.message)
  }

  return data
}