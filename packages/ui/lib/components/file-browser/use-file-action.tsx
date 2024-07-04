/* eslint-disable react-hooks/exhaustive-deps */
import { ChonkyActions, ChonkyFileActionData, ChonkyIconName, FileActionData } from "@aperturerobotics/chonky";
import { OpenFilesPayload } from "@aperturerobotics/chonky/dist/types/action-payloads.types";
import { BucketObject } from "@shopifize/helpers";
import { RefObject, SetStateAction, useCallback } from "react";

export type CreateActionType = FileActionData<{
  readonly id: "create_folder";
  readonly button: {
    readonly name: "Create folder";
    readonly toolbar: true;
    readonly tooltip: "Create a folder";
    readonly icon: ChonkyIconName.folderCreate;
  };
}>

export type UploadActionType = FileActionData<{
  readonly id: "upload_files";
  readonly button: {
    readonly name: "Upload files";
    readonly toolbar: true;
    readonly tooltip: "Upload files";
    readonly icon: ChonkyIconName.upload;
  };
}>

export type DeleteActionType = FileActionData<{
  readonly id: "delete_files";
  readonly requiresSelection: true;
  readonly hotkeys: readonly ["delete"];
  readonly button: {
    readonly name: "Delete files";
    readonly toolbar: true;
    readonly contextMenu: true;
    readonly group: "Actions";
    readonly icon: ChonkyIconName.trash;
  };
}>

interface Props {
  handleCreateFolder?: (data: CreateActionType) => void
  handleUploadFiles?: (data: UploadActionType) => void
  handleDeleteFile?: (data: DeleteActionType) => void
  folderPrefixCallback?: (folderPrefix: string) => void
  setKeyPrefix: (value: SetStateAction<string>) => void
  handleSelectFile?: (data: BucketObject) => void
  downloadImageRef?: RefObject<HTMLAnchorElement>
}

export const useFileAction = (props: Props) => {
  const {
    handleCreateFolder,
    handleUploadFiles,
    folderPrefixCallback,
    setKeyPrefix,
    handleDeleteFile,
    handleSelectFile,
    downloadImageRef
  } = props;

  const handleFileAction = useCallback(
    (data: ChonkyFileActionData) => {
      switch (data.id) {
        case ChonkyActions.OpenFiles.id:
          handleOpenFiles(data)
          break;
        case ChonkyActions.DownloadFiles.id:
          handleDownloadFile(data)
          break;
        case ChonkyActions.CreateFolder.id:
          handleCreateFolder?.(data)
          break;
        case ChonkyActions.UploadFiles.id:
          handleUploadFiles?.(data)
          break;
        case ChonkyActions.DeleteFiles.id:
          handleDeleteFile?.(data)
          break;
        default:
          break;
      }
    },
    [setKeyPrefix, downloadImageRef?.current]
  );

  const handleOpenFiles = (data: FileActionData<{
    readonly id: "open_files";
    readonly __payloadType: OpenFilesPayload;
  }>) => {
    if (data.payload.files && data.payload.files.length !== 1) {
      return
    }
    if (!data.payload.targetFile || !data.payload.targetFile.isDir) {
      //HANDLE SELECT FILE
      handleSelectFile?.(data.payload.targetFile as BucketObject)
      return
    }
    const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
    folderPrefixCallback?.(newPrefix)
    setKeyPrefix(newPrefix);
  }

  const handleDownloadFile = (data: FileActionData<{
    readonly id: "download_files";
    readonly requiresSelection: true;
    readonly button: {
      readonly name: "Download files";
      readonly toolbar: true;
      readonly contextMenu: true;
      readonly group: "Actions";
      readonly icon: ChonkyIconName.download;
    };
  }>) => {
    if (downloadImageRef && downloadImageRef.current) {
      downloadImageRef.current.href = data.state.selectedFilesForAction[0].thumbnailUrl as string
      downloadImageRef.current.click()
    }
  }

  return { handleFileAction }
}