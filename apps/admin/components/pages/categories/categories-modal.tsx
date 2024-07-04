import { CustomInput, CustomModal, CustomModalProps } from "@shopifize/ui"
import { useFormik } from "formik"
import * as Yup from 'yup'

interface Props extends CustomModalProps {
  handleClose: () => void
  handleSubmit: (values: CategoryFormType) => void
  values?: CategoryFormType
  isEdit: boolean
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  description: Yup.string().required('Category description is required')
})

export type CategoryFormType = Yup.InferType<typeof validationSchema>;

export const CategoryModal = (props: Props) => {
  const { handleSubmit, handleClose, isEdit, values, ...delegated } = props;

  const initialValues: CategoryFormType = {
    name: values?.name ?? '',
    description: values?.description ?? ''
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit
  })

  return <>
    <CustomModal
      {...delegated}
      title={isEdit ? "Edit Category" : "Add Category"}
      actionsProps={{
        applyButtonProps: {
          content: isEdit ? 'Apply' : 'Save',
          color: "primary",
          type: "submit",
          form: isEdit ? "edit-product-form" : "add-product-form"
        },
        cancelButtonProps: {
          variant: "text",
          sx: { color: (theme) => theme.customPalette.grey100 },
          onClick: handleClose,
        },
      }}
    >
      <form id={isEdit ? "edit-product-form" : "add-product-form"} onSubmit={formik.handleSubmit}>
        <CustomInput formik={formik} name={"name"} label="Name" />
        <CustomInput formik={formik} name={"description"} label="Description" />
      </form>
    </CustomModal>
  </>
}