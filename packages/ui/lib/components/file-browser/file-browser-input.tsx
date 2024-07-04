import { Box, ButtonBase, ButtonBaseProps, FormControl } from "@mui/material"
import { useId, useState } from "react"
import { CustomTypography, FileBrowserProps } from ".."
import { BucketObject, isEmpty, removeItemByIndex } from "@shopifize/helpers"
import { FileBrowserModal } from "./file-browser-modal"
import { useOpenState } from "../../hooks"
import { FileBrowserList } from "./components"
import { FormikProps } from "formik"
import { CustomHelperText } from "../helper-text"
import { useInputFormik } from "../../hooks/use-input-formik"

interface Props<T> extends FileBrowserProps {
  name?: keyof T;
  arrayName?: string;
  isMultiple?: boolean;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  ref?: React.ForwardedRef<HTMLButtonElement>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  handleSubmit: (value: string[] | string | null) => void
}

export type CustomFileBrowserInputProps<T> = Props<T> & ButtonBaseProps

export const CustomFileBrowserInput = <T,>(props: CustomFileBrowserInputProps<T>) => {
  const {
    isMultiple = false,
    bucketName,
    files,
    id: idProp,
    sx,
    visuallyHidden,
    label,
    name,
    arrayName,
    formik,
    errorMessage,
    helperText,
    helperTextHidden,
    handleSubmit,
    selectFileCallback,
    deleteFilesCallback,
    uploadFilesCallback,
    folderPrefixCallback,
    createFolderCallback
  } = props;
  const { isOpen, open, close } = useOpenState()
  const [selectedFiles, setSelectedFiles] = useState<BucketObject[]>([])
  //
  let id = useId();
  const helperTextId = useId();

  id = idProp ?? id;

  const { inputName, formikErrorMessage, isError, value } = useInputFormik<T, string | string[]>({
    name: name?.toString(),
    arrayName,
    formik
  })

  const handleModalClose = () => {
    close()
    formik?.setFieldTouched(inputName.toString(), true)
  }

  const handleFormikChange = (values: string | string[] | null) => {
    formik?.setFieldValue(inputName.toString(), values)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = removeItemByIndex(selectedFiles, index)
    setSelectedFiles(newImages)
    if (!isMultiple) {
      handleFormikChange(null)
      handleSubmit(null)
    } else {
      handleFormikChange(newImages.map((value) => value.thumbnailUrl!))
      handleSubmit(newImages.map((value) => value.thumbnailUrl!))
    }
  }

  return <>
    <FormControl error={isError} sx={{ width: "100%", ...sx }}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
        htmlFor={id}
      >
        {label}
      </CustomTypography>
      <ButtonBase
        id={id}
        sx={{
          padding: '1rem',
          border: isError ? `1px solid #d32f2f` : `1px solid rgba(0,0,0,.14)`, //TODO apply theme
          width: isMultiple ? '100%' : 'fit-content',
          borderRadius: (theme) => theme.borderRadius[4],
          backgroundColor: (theme) => theme.customPalette.background,
          transition: 'background-color ease-in-out 0.25s',
          '&:focus-visible, &:focus, &:hover:focus': {
            outline: (theme) => `2px solid ${isError ? theme.customPalette.errorStatus : theme.customPalette.main}`
          },
          '&:hover': {
            outline: isError ? `1px solid #af2121` : `1px solid black`,
            backgroundColor: (theme) => theme.customPalette.grey10
          }
        }}
        onClick={open}
        onBlur={formik?.handleBlur}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: !isEmpty(selectedFiles) ? 'left' : 'center'
          }}
        >
          <FileBrowserList
            isMultiple={isMultiple}
            selectedFiles={selectedFiles}
            listPreviewImages={value ? (Array.isArray(value) ? value : [value]) : undefined}
            handleRemoveImage={handleRemoveImage}
          />
        </Box>
      </ButtonBase>
      <CustomHelperText
        helperTextId={helperTextId}
        isError={isError}
        errorMessage={errorMessage}
        formikErrorMessage={formikErrorMessage}
        helperText={helperText}
        helperTextHidden={helperTextHidden}
        visuallyHidden={visuallyHidden}
      />
    </FormControl>
    <FileBrowserModal
      files={files}
      open={isOpen}
      value={value}
      isMultiple={isMultiple}
      bucketName={bucketName}
      errorMessage={errorMessage}
      selectedFiles={selectedFiles}
      handleClose={handleModalClose}
      handleSubmit={handleSubmit}
      setSelectedFiles={setSelectedFiles}
      handleFormikChange={handleFormikChange}
      selectFileCallback={selectFileCallback}
      deleteFilesCallback={deleteFilesCallback}
      uploadFilesCallback={uploadFilesCallback}
      folderPrefixCallback={folderPrefixCallback}
      createFolderCallback={createFolderCallback}
    />
  </>
}