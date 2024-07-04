import { BucketObject, ResponseType } from "@shopifize/helpers";
import { CustomFileBrowserInput, CustomFileBrowserInputProps, DEFAULT_PREFIX } from "@shopifize/ui";
import { ProviderContext } from "notistack";
import { useState } from "react";
import { useCreateAssetFolderMutation, useDeleteAssetObjectMutation, useGetAssetObjectsQuery, useUploadAssetObjectsMutation } from "~/queries/assets";

interface Props {
  snackbar: ProviderContext
}

export type FileBrowserProps<T> = Props & Omit<CustomFileBrowserInputProps<T>, 'handleSubmit' | 'files' | 'bucketName'>

export const FileBrowser = <T,>(props: FileBrowserProps<T>) => {
  const { enqueueSnackbar } = props.snackbar
  const [folderPrefix, setFolderPrefix] = useState<string>(DEFAULT_PREFIX)
  const { data, refetch } = useGetAssetObjectsQuery(folderPrefix)
  const { mutate: deleteObjects } = useDeleteAssetObjectMutation()
  const { mutate: createFolder } = useCreateAssetFolderMutation()
  const { mutateAsync: uploadObject } = useUploadAssetObjectsMutation()

  const handleFolderPrefixCallback = (prefix: string) => {
    setFolderPrefix(prefix)
  }

  const handleCreateFolderCallback = (folderName: string) => {
    createFolder({ folderName, folderPrefix }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleUploadFilesCallback = async (files: FileList) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append(`files`, file);
      })

      const data = await uploadObject({folderPrefix, formData})

      if (data.success) {
        enqueueSnackbar('Upload files successfully', { variant: 'success' })
        refetch()
      }
      if (data.error) {
        enqueueSnackbar('Failed to upload files', { variant: 'error' })
      }
    } catch (e) {
      enqueueSnackbar('Failed to upload files', { variant: 'error' })
    }
  }

  const handleDeleteFilesCallback = (paths: string[] | undefined) => {
    if (paths) {
      deleteObjects({ paths: paths }, {
        onSuccess: () => {
          enqueueSnackbar('Delete files successfully', { variant: 'success' })
          refetch()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    }
  }

  return (
    <>
      <CustomFileBrowserInput
        bucketName="shopifized"
        files={data?.data ?? []}
        folderPrefixCallback={handleFolderPrefixCallback}
        createFolderCallback={handleCreateFolderCallback}
        uploadFilesCallback={handleUploadFilesCallback}
        deleteFilesCallback={handleDeleteFilesCallback}
        handleSubmit={(value) => console.log({ value })}
        {...props}
      />
    </>
  );
}