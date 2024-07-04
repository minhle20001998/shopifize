import { Stack } from "@mui/material"
import { CustomInput } from ".."
import { useFormik } from "formik"
import { useRouter } from "next/router";

export const CustomTableFilterForm = (props: { id: string, title: string }) => {
  const { id, title } = props;
  const router = useRouter()
  const query = router.query

  const initialValues = {
    [id]: query[id]?.toString() ?? ''
  }

  const handleSubmit = (values: {
    [x: string]: string;
  }) => {
    const isEmpty = values[id] === ''
    const searchParams = !isEmpty ? {[id]: values[id]} : {}
    if(isEmpty) {
      delete query[id]
    }
    router.replace({
      pathname: location.pathname,
      search: new URLSearchParams({
        ...query as object,
        ...searchParams
      }).toString()
    })
  }

  const formik = useFormik({ initialValues, onSubmit: handleSubmit })

  return <>
    <Stack gap={'1rem'} sx={{ padding: '0.2rem 1rem 0.6rem 1rem' }}>
      <form onSubmit={formik.handleSubmit}>
        <CustomInput formik={formik} name={id} placeholder={`Filter ${title}`} label={title} helperTextHidden />
      </form>
    </Stack>
  </>
}