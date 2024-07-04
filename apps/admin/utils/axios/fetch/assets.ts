import { BucketObject, ResponseType } from "@shopifize/helpers"
import { assetClient } from "../clients"
import { CreateAssetFolderType, DeleteAssetObjectType, UploadAssetType } from "~/utils/types"
import { AxiosError } from "axios"

export const getAssetObjects = async (prefix: string) => {
  const { data } = await assetClient.get<ResponseType<BucketObject[]>>(`/objects?prefix=${prefix}`)
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const createAssetFolder = async ({ folderName, folderPrefix }: CreateAssetFolderType) => {
  const { data } = await assetClient.post<ResponseType<null>>(`/folder`, {
    folderName: folderName,
    folderPrefix: folderPrefix
  })
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const uploadAssetObjects = async ({ folderPrefix, formData }: UploadAssetType) => {
  const { data } = await assetClient.post<ResponseType<null>>(`/upload?prefix=${folderPrefix}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data
}

export const deleteAssetObject = async ({ paths }: DeleteAssetObjectType) => {
  const { data } = await assetClient.post<ResponseType<null>>('/objects/delete', {
    paths: paths
  })
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data.data
}

