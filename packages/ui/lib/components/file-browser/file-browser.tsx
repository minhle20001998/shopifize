/* eslint-disable react-hooks/exhaustive-deps */
import { BucketObject } from "@shopifize/helpers"
import { ChonkyActions, FileArray, FileBrowser, FileContextMenu, FileData, FileList, FileNavbar, FileToolbar, defineFileAction, setChonkyDefaults } from "@aperturerobotics/chonky"
import { ChangeEvent, useMemo, useRef, useState } from "react"
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome';
import path from 'path';
import { CreateActionType, DeleteActionType, useFileAction } from "./use-file-action";
import { CustomModal, DeleteConfirmationModal } from "..";
import { useOpenState } from "../../hooks";
import { CreateFolderForm } from "./forms";
import { Box } from "@mui/material";
import { ViewUploadFiles } from "./components";

export interface FileBrowserProps {
  errorMessage?: string
  files: BucketObject[]
  bucketName: string
  selectFileCallback?: (file: BucketObject) => void
  folderPrefixCallback?: (folderPrefix: string) => void
  createFolderCallback?: (folderName: string, data?: CreateActionType) => void
  uploadFilesCallback?: (files: FileList) => void
  deleteFilesCallback?: (fileNames?: string[]) => void
}

// const Rename = defineFileAction({
//   id: 'rename_file',
//   requiresSelection: true,
//   button: {
//     name: 'Rename',
//     toolbar: true,
//     contextMenu: true,
//     icon: ChonkyIconName.code
//   }
// })

// const Preview = defineFileAction({
//   id: 'preview_selected',
//   fileFilter: (file) => !!file && !file?.isDir,
//   requiresSelection: true,
//   button: {
//     name: 'Preview',
//     toolbar: true,
//     contextMenu: true,
//     icon: ChonkyIconName.image
//   }
// })

const Download = defineFileAction({
  ...ChonkyActions.DownloadFiles,
  fileFilter: (file) => !!file && !file?.isDir,
  button: {
    ...ChonkyActions.DownloadFiles.button,
    name: 'Download',
    group: undefined
  }
})

const Delete = defineFileAction({
  ...ChonkyActions.DeleteFiles,
  button: {
    ...ChonkyActions.DeleteFiles.button,
    group: undefined,
    name: 'Delete'
  }
})

const Upload = defineFileAction({
  ...ChonkyActions.UploadFiles,
  button: {
    ...ChonkyActions.UploadFiles.button,
    group: undefined,
    name: 'Upload'
  }
})

const CreateFolder = defineFileAction({
  ...ChonkyActions.CreateFolder,
  button: {
    ...ChonkyActions.CreateFolder.button,
    group: undefined,
    name: 'Create'
  }
})

export const DEFAULT_PREFIX = '/'

export const CustomFileBrowser = (props: FileBrowserProps) => {
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const { files,
    bucketName,
    errorMessage,
    selectFileCallback,
    folderPrefixCallback,
    createFolderCallback,
    uploadFilesCallback,
    deleteFilesCallback
  } = props
  const { isOpen: isCreateFolderOpen, open: openCreateFolder, close: closeCreateFolder } = useOpenState()
  const { isOpen: isUploadFilesOpen, open: openUploadFiles, close: closeUploadFiles } = useOpenState()
  const { isOpen: isDeleteFilesOpen, open: openDeleteFiles, close: closeDeleteFiles } = useOpenState()
  const [createActionData, setCreateActionData] = useState<CreateActionType | undefined>(undefined)
  const [folderPrefix, setKeyPrefix] = useState<string>(DEFAULT_PREFIX);
  const [uploadFiles, setUploadFiles] = useState<FileList | undefined>(undefined)
  const [deleteFiles, setDeleteFiles] = useState<string[] | undefined>(undefined)
  const downloadImageRef = useRef<HTMLAnchorElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folderChain = useMemo(() => {
    let folderChain: FileArray;
    if (folderPrefix === '/') {
      folderChain = [];
    } else {
      let currentPrefix = '';
      folderChain = folderPrefix
        .replace(/\/*$/, '')
        .split('/')
        .map(
          (prefixPart): FileData => {
            currentPrefix = currentPrefix
              ? path.join(currentPrefix, prefixPart)
              : prefixPart;
            return {
              id: currentPrefix,
              name: prefixPart,
              isDir: true,
            };
          }
        );
    }
    folderChain.unshift({
      id: '/',
      name: bucketName,
      isDir: true,
    });
    return folderChain;
  }, [folderPrefix]);


  const fileActions = useMemo(
    () => [
      ChonkyActions.OpenParentFolder,
      ChonkyActions.MoveFiles,
      CreateFolder,
      Upload,
      Download,
      Delete,
      // Rename,
      // Preview
    ],
    []
  );

  const disabledActions = useMemo(() => [
    ChonkyActions.ClearSelection.id,
    ChonkyActions.OpenSelection.id,
    ChonkyActions.SelectAllFiles.id,
    ChonkyActions.ToggleHiddenFiles.id
  ], [])


  const handleCreateFolder = (e: CreateActionType) => {
    openCreateFolder()
    setCreateActionData(e)
  }

  const handleOpenOSFileBrowser = () => {
    fileInputRef.current?.click()
  }

  const handleSelectUploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadFiles(e.currentTarget.files ?? undefined)
    if (e.currentTarget.files?.length) {
      openUploadFiles()
    }
  }

  const handleDeleteFile = (e: DeleteActionType) => {
    const filenames = e.state.selectedFiles.map((file) => file.id)
    setDeleteFiles(filenames)
    openDeleteFiles()
  }

  const { handleFileAction } = useFileAction({
    setKeyPrefix,
    folderPrefixCallback,
    handleCreateFolder,
    handleUploadFiles: handleOpenOSFileBrowser,
    handleSelectFile: selectFileCallback,
    handleDeleteFile,
    downloadImageRef
  })

  const handleCreateFolderFormSubmit = (data: { folderName: string }) => {
    createFolderCallback?.(data.folderName, createActionData)
    setCreateActionData(undefined)
    closeCreateFolder()
  }

  const handleCloseSelectUpload = () => {
    setUploadFiles(undefined)
    closeUploadFiles()
  }

  const handleConfirmUploadFiles = () => {
    if (uploadFiles) {
      uploadFilesCallback?.(uploadFiles)
    }
    handleCloseSelectUpload()
  }

  const handleCloseDeleteModal = () => {
    setDeleteFiles(undefined)
    closeDeleteFiles()
  }

  const handleConfirmDeleteFiles = () => {
    deleteFilesCallback?.(deleteFiles)
    handleCloseDeleteModal()
  }

  return <>
    {errorMessage && (
      <div className="story-error">
        An error has occurred while loading bucket:
        <strong>{errorMessage}</strong>
      </div>
    )}
    <a ref={downloadImageRef} target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}></a>
    <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleSelectUploadFiles} multiple />
    <Box sx={{
      height: '100%',
      '& fieldset': {
        borderColor: (theme) => `${theme.customPalette.main} !important`
      },
      '& button span, & svg': {
        color: (theme) => theme.customPalette.main
      },
      '& button:disabled span, & button:disabled svg': {
        color: (theme) => theme.customPalette.disabled
      }
    }}>
      <FileBrowser
        disableDragAndDropProvider
        files={files}
        folderChain={folderChain}
        onFileAction={handleFileAction}
        fileActions={fileActions}
        defaultFileViewActionId={ChonkyActions.EnableGridView.id}
        disableDefaultFileActions={disabledActions}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
      <Box></Box>
      <CustomModal
        size="sm"
        open={isCreateFolderOpen}
        onClose={closeCreateFolder}
        title={"Create Folder"}
        actionsProps={{
          applyButtonProps: {
            color: "primary",
            type: "submit",
            form: "create-folder-form"
          },
          cancelButtonProps: {
            variant: "text",
            sx: { color: (theme) => theme.customPalette.grey100 },
            onClick: closeCreateFolder,
          },
        }}
      >
        <CreateFolderForm onSubmit={handleCreateFolderFormSubmit} />
      </CustomModal>
      <CustomModal
        size="sm"
        open={isUploadFilesOpen}
        onClose={handleCloseSelectUpload}
        title={"Upload Files"}
        actionsProps={{
          applyButtonProps: {
            color: "primary",
            children: 'Upload',
            onClick: handleConfirmUploadFiles
          },
          cancelButtonProps: {
            variant: "text",
            sx: { color: (theme) => theme.customPalette.grey100 },
            onClick: handleCloseSelectUpload,
          },
        }}
      >
        <ViewUploadFiles uploadFiles={uploadFiles} />
      </CustomModal>
      <DeleteConfirmationModal
        size="sm"
        title="Delete item(s)"
        open={isDeleteFilesOpen}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleConfirmDeleteFiles}
      >
        Do you want to permenatly delete these files ?
      </DeleteConfirmationModal>
    </Box>
  </>
} 