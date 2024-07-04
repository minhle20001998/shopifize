import { capitalize } from "@shopifize/helpers"
import { CustomModal, CustomModalProps, CustomSelect, Options } from "@shopifize/ui"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useGetRolesQuery, useGetUserQuery } from "~/queries/users"

interface Props extends CustomModalProps {
  handleClose: () => void
  handleSubmit: (values: RoleEditFormType) => void
  userId?: string
  values?: RoleEditFormType
}

const validationSchema = Yup.object().shape({
  roles: Yup.array().of(Yup.string()).min(1, "Require at least one role").required("Require at least one role")
})

export type RoleEditFormType = Yup.InferType<typeof validationSchema>

export const UserEditModal = (props: Props) => {

  const { userId, handleSubmit, handleClose, values, ...delegated } = props;
  const {data: user} = useGetUserQuery(userId!, {
    enabled: !!userId
  })
  const { data: roles } = useGetRolesQuery()


  const initialValues: RoleEditFormType = {
    roles: user?.data.roles.map((role) => role.role) || []
  }

  const options: Options[] = roles?.data.map((role) => {return {label: capitalize(role), id: role}}) || []

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit
  })

  return <>
    <CustomModal
      {...delegated}
      size="sm"
      title={"Edit User"}
      actionsProps={{
        applyButtonProps: {
          content: 'Save',
          color: "primary",
          type: "submit",
          form: "edit-user-form"
        },
        cancelButtonProps: {
          variant: "text",
          sx: { color: (theme) => theme.customPalette.grey100 },
          onClick: handleClose,
        },
      }}
    >
      <form id={"edit-user-form"} onSubmit={formik.handleSubmit}>
        <CustomSelect multiple options={options} label="Roles" formik={formik} name="roles" />
      </form>
    </CustomModal>
  </>
}