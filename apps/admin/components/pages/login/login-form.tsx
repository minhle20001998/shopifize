import { LOGIN_FAILED, ResponseType } from "@shopifize/helpers";
import { CustomButton, CustomCheckbox, CustomInput, CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useFormik } from "formik";
import Router from "next/router";
import * as Yup from "yup";
import { useAuthQuery, useProfileQuery } from "~/queries";
import { useSearchParams } from "next/navigation";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
});

export type LoginValueType = Yup.InferType<typeof validationSchema>;

export const LoginForm = () => {

  const theme = useTheme()

  const { login, enqueueSnackbar } = useAuthQuery()
  const { invalidate } = useProfileQuery();

  const initialValues = {
    email: '',
    password: ''
  }

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? "/";

  const loginOnSuccess = ({
    data,
    error,
  }: ResponseType<{ accessToken: string; refreshToken: string }>) => {
    if (error?.message === LOGIN_FAILED) {
      formik.setErrors({
        email: "Your email or password could be incorrect",
        password: " ",
      });
      return;
    }
    enqueueSnackbar("Login successfully", { variant: "success" });
    enqueueSnackbar("Redirecting...", { variant: "success" });
    invalidate?.(() => {
      localStorage.setItem("refresh_token", data.refreshToken);
      void Router.push(redirectUrl);
    });
  };

  const handleSubmit = (values: LoginValueType) => {
    login.mutate(values, {
      onSuccess: loginOnSuccess
    })
  }

  const formik = useFormik({ initialValues, validationSchema, onSubmit: handleSubmit })

  return <form style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: theme.boxShadows.depth16,
    maxWidth: '400px',
  }}
    onSubmit={formik.handleSubmit}
  >
    <MUI.Box sx={{
      borderTopLeftRadius: theme.borderRadius[8],
      borderTopRightRadius: theme.borderRadius[8],
      padding: '2rem 1rem 2rem 1rem',
      backgroundColor: theme.customPalette.main
    }}>
      <CustomTypography
        as={'h1'}
        sx={{
          fontSize: theme.customTypography.fontSizes.header3,
          textAlign: 'center',
          color: theme.customPalette.white,
          letterSpacing: '0.12rem'
        }}
      >
        Shopifize Administration
      </CustomTypography>
    </MUI.Box>
    <MUI.Box sx={{
      padding: '1rem 1.5rem 2rem 1.5rem'
    }}>
      <CustomInput label="Email" name="email" formik={formik} />
      <CustomInput label="Password" name='password' type="password" formik={formik} />
      <CustomCheckbox label="Stay sign in" />
      <CustomButton type="submit" sx={{ marginTop: '1rem' }}>Log in</CustomButton>
    </MUI.Box>
  </form>
}