import { useFormik } from "formik";
import { CustomInput } from "../..";

interface Props {
  onSubmit: (formData: { folderName: string }) => void
}

export const CreateFolderForm = (props: Props) => {
  const { onSubmit } = props;

  const initialValues = {
    folderName: ''
  }

  const formik = useFormik({ initialValues, onSubmit })

  return <form id="create-folder-form" onSubmit={formik.handleSubmit}>
    <CustomInput
      name="folderName"
      label="Folder Name"
      placeholder="Enter folder name"
      formik={formik}
    />
  </form>
}