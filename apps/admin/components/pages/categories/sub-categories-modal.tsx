import { SubCategory } from "@shopifize/helpers";
import { Column, CustomButton, CustomModal, CustomModalProps, CustomTable, CustomTypography, DeleteConfirmationModal, MUI, MUIIcon, useOpenState } from "@shopifize/ui";
import { SubCategoriesEditModal, SubCategoriesFormType } from "./sub-categories-edit-modal";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useAddSubCategoryMutation, useDeleteSubCategoryMutation, useGetSubCategoriesQuery, useInvalidateSubCategoryQuery, useUpdateSubCategoryMutation } from "~/queries/sub-categories";
import { useInvalidateCategoryQuery } from "~/queries/categories";

interface Props extends CustomModalProps {
  categoryId?: string
  handleClose: () => void
}


export const SubCategoriesModal = (props: Props) => {
  const { categoryId, handleClose, ...delegated } = props
  const { isOpen, open, close } = useOpenState()
  const { enqueueSnackbar } = useSnackbar()
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useOpenState()
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined)
  const {data: subCategories} = useGetSubCategoriesQuery(categoryId)
  const { mutate: createSubCategory } = useAddSubCategoryMutation()
  const { mutate: updateSubCategory } = useUpdateSubCategoryMutation()
  const { mutate: deleteSubCategory } = useDeleteSubCategoryMutation()
  const {invalidateCategoryQuery} = useInvalidateCategoryQuery()
  const {invalidateSubCategoryQuery} = useInvalidateSubCategoryQuery(categoryId)

  const columns: Column<SubCategory>[] = [
    { id: 'name', name: 'Name' },
    { id: 'description', name: 'Description' },
    {
      id: 'actions', name: 'Actions', type: {
        actions: [
          {
            name: 'Edit', variant: 'edit', callback: (data) => {
              setSubCategoryId(data.id)
              open()
            }
          },
          {
            name: 'Delete', variant: 'delete', callback: (data) => {
              setSubCategoryId(data.id)
              openDelete()
            }
          },
        ]
      }
    }
  ]

  const handleOnClose = () => {
    close()
    closeDelete()
    setSubCategoryId(undefined)
  }

  const handleDelete = () => {
    if (subCategoryId) {
      deleteSubCategory({ id: subCategoryId }, {
        onSuccess: () => {
          enqueueSnackbar('Delete sub category successfully', { variant: 'success' })
          invalidateCategoryQuery()
          invalidateSubCategoryQuery()
          handleOnClose()
        }
      })
    }
  }

  const handleSubmit = (data: SubCategoriesFormType) => {
    const isEdit = !!subCategoryId
    if (!categoryId) {
      return;
    }
    if (isEdit) {
      updateSubCategory({ id: subCategoryId, categoryId: categoryId, ...data }, {
        onSuccess: () => {
          enqueueSnackbar('Update Sub Category successfully', { variant: 'success' })
          invalidateCategoryQuery()
          invalidateSubCategoryQuery()
          handleOnClose()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    } else {
      createSubCategory({ categoryId: categoryId, ...data }, {
        onSuccess: () => {
          invalidateCategoryQuery()
          invalidateSubCategoryQuery()
          enqueueSnackbar('Create Sub Category successfully', { variant: 'success' })
          handleOnClose()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    }
  }

  return <>
    <CustomModal
      {...delegated}
      size="lg"
      title={
        <>
          <MUI.Stack direction={'row'} justifyContent={'space-between'}>
            <CustomTypography fontSize={'header4'}>Sub Categories</CustomTypography>
            <CustomButton
              fullWidth={false}
              startIcon={<MUIIcon.Add />}
              onClick={open}
            >
              Sub Category
            </CustomButton>
          </MUI.Stack>
        </>
      }
      actionsProps={{
        cancelButtonProps: {
          variant: "text",
          sx: { color: (theme) => theme.customPalette.grey100 },
          onClick: handleClose,
        },
      }}>
      <CustomTable data={subCategories?.data || []} columns={columns} />
    </CustomModal>
    <SubCategoriesEditModal
      key={String(isOpen)}
      open={isOpen}
      subCategoryId={subCategoryId}
      handleClose={handleOnClose}
      handleSubmit={handleSubmit}
    />
    <DeleteConfirmationModal
      title='Confirm delete'
      open={isDeleteOpen}
      handleDelete={handleDelete}
      handleClose={handleOnClose}
    >
      Are you sure you want to delete this item?
    </DeleteConfirmationModal>
  </>
}