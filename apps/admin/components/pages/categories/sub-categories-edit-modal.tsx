import { CustomInput, CustomModal, CustomModalProps } from "@shopifize/ui"
import { useFormik } from "formik";
import * as Yup from 'yup'
import { useGetSubCategoryQuery } from "~/queries/sub-categories";

interface Props extends CustomModalProps {
  subCategoryId?: string
  handleClose: () => void
  handleSubmit: (data: SubCategoriesFormType) => void
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Sub Category name is required'),
  description: Yup.string().required('Sub Category description is required')
})

export type SubCategoriesFormType = Yup.InferType<typeof validationSchema>

export const SubCategoriesEditModal = (props: Props) => {
  const { handleClose, handleSubmit, subCategoryId, ...delegated } = props;
  const isEdit = !!subCategoryId
  const { data: subCategory } = useGetSubCategoryQuery(subCategoryId!, { enabled: !!subCategoryId })
  const initialValues = {
    name: subCategory?.data.name ?? '',
    description: subCategory?.data.description ?? ''
  }

  const formik = useFormik({ initialValues, validationSchema, onSubmit: handleSubmit, enableReinitialize: true })

  return <>
    <CustomModal
      {...delegated}
      title={isEdit ? "Edit Sub Category" : "Add Sub Category"}
      actionsProps={{
        applyButtonProps: {
          color: "primary",
          content: "Save",
          form: 'sub-categories-form',
          type: 'submit'
        },
        cancelButtonProps: {
          variant: "text",
          sx: { color: (theme) => theme.customPalette.grey100 },
          onClick: handleClose,
        },
      }}
    >
      <form id='sub-categories-form' onSubmit={formik.handleSubmit}>
        <CustomInput formik={formik} name='name' label='Name' />
        <CustomInput formik={formik} name="description" label='Description' />
      </form>
    </CustomModal>
  </>
}