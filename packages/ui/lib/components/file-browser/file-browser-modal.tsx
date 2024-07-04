import { Dispatch, SetStateAction } from "react";
import { CustomFileBrowser, CustomModal, CustomModalProps, FileBrowserProps } from "..";
import { BucketObject, isEmpty } from "@shopifize/helpers";

interface Props extends CustomModalProps {
  value?: string | string[]
  isMultiple?: boolean
  selectedFiles?: BucketObject[]
  handleClose: () => void
  handleSubmit: (value: string[] | string) => void
  setSelectedFiles?: Dispatch<SetStateAction<BucketObject[]>>
  handleFormikChange?: (value: string[] | string) => void
}

type FileBrowserModalProps = Props & FileBrowserProps

export const FileBrowserModal = (props: FileBrowserModalProps) => {

  const {
    files,
    value = [],
    isMultiple,
    bucketName,
    selectedFiles,
    errorMessage,
    handleClose,
    handleSubmit,
    setSelectedFiles,
    handleFormikChange,
    createFolderCallback,
    folderPrefixCallback,
    uploadFilesCallback,
    deleteFilesCallback,
    ...delegated
  } = props;

  const handleSelectFile = (file: BucketObject) => {
    if (isMultiple && Array.isArray(value)) {
      const isDuplicated = selectedFiles?.some((value) => value.id === file.id)
      const currentFiles = !isEmpty(selectedFiles) ? isDuplicated ? selectedFiles! : [...selectedFiles!, file] : [file]
      const filepaths = currentFiles.map((file) => {
        return file.thumbnailUrl!
      })
      setSelectedFiles?.(currentFiles)
      handleSubmit(Array.from(new Set([...value, ...filepaths])))
      handleFormikChange?.(Array.from(new Set([...value, ...filepaths])))
    } else {
      const currentFiles = [file]
      setSelectedFiles?.(currentFiles)
      handleSubmit(file.thumbnailUrl!)
      handleFormikChange?.(file.thumbnailUrl!)
    }
    handleClose()
  }

  return <CustomModal
    {...delegated}
    bodySx={{
      height: '80vh'
    }}
    size="lg"
    title='File Browser'
    actionsProps={{
      cancelButtonProps: {
        variant: "text",
        sx: { color: (theme) => theme.customPalette.grey100 },
        onClick: handleClose,
      },
    }}
  >
    <CustomFileBrowser
      files={files}
      bucketName={bucketName}
      errorMessage={errorMessage}
      createFolderCallback={createFolderCallback}
      folderPrefixCallback={folderPrefixCallback}
      uploadFilesCallback={uploadFilesCallback}
      deleteFilesCallback={deleteFilesCallback}
      selectFileCallback={handleSelectFile}
    />
  </CustomModal>
}