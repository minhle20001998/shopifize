import { useQueryClient } from "@tanstack/react-query"
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation"
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery"
import { createAssetFolder, deleteAssetObject, getAssetObjects, uploadAssetObjects } from "~/utils/axios/fetch"
import { CreateAssetFolderType, DeleteAssetObjectType, UploadAssetType } from "~/utils/types"

export const GET_ASSET_OBJECTS_KEY = "GET_ASSET_OBJECTS_KEY"

export const useGetAssetObjectsQuery = (prefix: string) => {
  const results = useShopifizedQuery([GET_ASSET_OBJECTS_KEY, prefix], () => {
    return getAssetObjects(prefix)
  })
  return results
}

export const useCreateAssetFolderMutation = () => {
  return useShopifizedMutation((input: CreateAssetFolderType) => {
    return createAssetFolder(input)
  })
}

export const useUploadAssetObjectsMutation = () => {
  return useShopifizedMutation((input: UploadAssetType) => {
    return uploadAssetObjects(input)
  })
}

export const useDeleteAssetObjectMutation = () => {
  return useShopifizedMutation((input: DeleteAssetObjectType) => {
    return deleteAssetObject(input)
  })
}

export const useInvalidateAssetQuery = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAssetQuery: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ASSET_OBJECTS_KEY]
      })
    }
  }
}