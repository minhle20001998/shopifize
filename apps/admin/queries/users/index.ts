import { ResponseType, User, UserRole } from "@shopifize/helpers"
import { UseQueryOptions, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery"
import { getRoles, getUser, getUsers, updateRole } from "~/utils/axios/fetch"
import { PaginationType } from "~/utils/types"

export const GET_USERS_KEY = 'GET_USERS_KEY'

export const GET_ROLES_KEY = 'GET_ROLES_KEY'

export const useGetUsersQuery = (input: PaginationType) => {
  const results = useShopifizedQuery([GET_USERS_KEY, input.limit, input.skip], () => getUsers(input))
  return results
}

export const useGetUserQuery = (userId: string, options?: UseQueryOptions<ResponseType<User>, AxiosError>) => {
  const results = useShopifizedQuery([GET_USERS_KEY, userId], () => {
    return getUser(userId)
  }, options)
  return results
}

export const useGetRolesQuery = () => {
  const results = useShopifizedQuery([GET_ROLES_KEY], getRoles)
  return results
}

export const useUpdateRoleMutation = () => {
  return useMutation((data: { userId: string, roles: UserRole[] }) => {
    return updateRole(data.userId, data.roles)
  })
}