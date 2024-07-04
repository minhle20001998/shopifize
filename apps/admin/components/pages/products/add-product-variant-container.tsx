import { BoxProps, CustomIconButton, CustomTypography, MUI, MUIIcon } from "@shopifize/ui";
import { FieldArrayRenderProps, FormikProps, getIn } from "formik";
import { Dispatch, PropsWithChildren, SetStateAction, useMemo, useRef } from "react";
import { ProductFormType } from "./add-product-form";
import { useProductContext } from "~/contexts/ProductActionContext";

export const AddProductVariantContainer = (props: PropsWithChildren<BoxProps & {
  index: number,
  arrayHelpers: FieldArrayRenderProps,
  formik: FormikProps<ProductFormType>,
  isLast: boolean,
  isFirst: boolean,
  isEdit: boolean,
  enableEdit: boolean,
  setEnableEdit: Dispatch<SetStateAction<boolean>>
}>) => {
  const { children, index, arrayHelpers, isLast, isFirst, formik, setEnableEdit, enableEdit, isEdit, ...boxProps } = props
  const { setEditVariantIds, setDeleteVariantIds } = useProductContext()
  const id = getIn(formik.values, `productVariants.${index}.id`)
  const clonedData = useRef<object | null>(null)

  const handleClickMoveUp = () => {
    arrayHelpers.move(index, index - 1)
  }

  const handleClickMoveDown = () => {
    arrayHelpers.move(index, index + 1)
  }

  const handleRemove = () => {
    arrayHelpers.remove(index)
    if (id) {
      setDeleteVariantIds?.((prev) => [...prev, id])
      setEditVariantIds?.((prev) => prev.filter((editId) => editId !== id))
    }
  }

  const handleEditEnable = () => {
    clonedData.current = getIn(formik.values, `productVariants.${index}`)
    setEnableEdit(true)
    //
    if (id) {
      setEditVariantIds?.((prev) => [...prev, id])
    }
  }

  const handleEditRevert = () => {
    //Revert data -> TODO
    if (clonedData.current) {
      formik.setFieldValue(`productVariants.${index}`, clonedData.current)
    }
    setEnableEdit(false)
    if (id) {
      setEditVariantIds?.((prev) => prev.filter((editId) => editId !== id))
    }
  }


  // check styles when editable 
  const isEditableStyle = useMemo(() => {
    if (!!!id || !isEdit) {
      return true
    }
    return enableEdit
  }, [id, isEdit, enableEdit])

  const renderEditButton = useMemo(() => {
    if (isEdit && !!id) {
      return <CustomIconButton onClick={enableEdit ? handleEditRevert : handleEditEnable}>
        {enableEdit ? <MUIIcon.Undo fontSize="small" /> : <MUIIcon.Edit fontSize="small" />}
      </CustomIconButton>
    }
    else {
      return <></>
    }
  }, [isEdit, enableEdit, id])


  return <MUI.Box
    sx={{
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: (theme) => isEditableStyle ? theme.customPalette.main10 : theme.customPalette.grey20,
      border: (theme) => `1px solid ${theme.customPalette.grey60}`,
      boxShadow: (theme) => isEditableStyle ? theme.boxShadows.depth8 : undefined,
      borderRadius: (theme) => isEditableStyle ? theme.borderRadius[8] : undefined,
      transition: 'all 0.25s ease-in-out'
    }}
    {...boxProps}
  >
    <MUI.Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
      <CustomTypography>No {index + 1}</CustomTypography>
      <MUI.Box>
        {renderEditButton}
        <CustomIconButton disabled={isFirst} onClick={handleClickMoveUp}>
          <MUIIcon.KeyboardArrowUp />
        </CustomIconButton>
        <CustomIconButton disabled={isLast} onClick={handleClickMoveDown}>
          <MUIIcon.KeyboardArrowDown />
        </CustomIconButton>
        <CustomIconButton onClick={handleRemove}>
          <MUIIcon.Close />
        </CustomIconButton>
      </MUI.Box>
    </MUI.Stack>
    <MUI.Divider style={{ marginBottom: '1rem' }} />
    {children}
  </MUI.Box >
}