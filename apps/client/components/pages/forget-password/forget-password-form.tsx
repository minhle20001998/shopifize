import { useFormik } from "formik";
import { useAuthQuery } from "queries";
import { useId } from "react";
import * as Yup from "yup";
import { ResponseType } from "@shopifize/helpers";
import {
  CustomButton,
  CustomInput,
  CustomLink,
  CustomTypography,
  MUI,
} from "@shopifize/ui";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
});

type ForgetPasswordValueType = Yup.InferType<typeof validationSchema>;

export function ForgetPasswordForm() {
  const id = useId();

  const onForgetPassSuccess = ({ success }: ResponseType<null>) => {
    if (success) {
      enqueueSnackbar(
        "We have sent the confirmation link to your email. Please check it as soon as possible",
        { variant: "success" }
      );
    }
  };

  const { forgetPassword, enqueueSnackbar } = useAuthQuery();

  const initialValues = {
    email: "",
  };

  const handleSubmit = (values: ForgetPasswordValueType) => {
    forgetPassword.mutate(values.email, { onSuccess: onForgetPassSuccess });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <MUI.Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "common.white",
        padding: "1rem",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <MUI.Stack>
          <CustomTypography variant="body1" fontWeight={"600"} id={id}>
            Enter the email associated with your account to change your
            password.
          </CustomTypography>
          <CustomInput
            formik={formik}
            aria-required
            variant="standard"
            placeholder="Enter your email"
            name="email"
            label="email"
            sx={{ marginTop: "1rem" }}
            autoFocus
            aria-describedby={id}
            visuallyHidden
          />
          <MUI.Box sx={{ marginTop: "0.4rem" }}>
            <CustomLink href={"/login"}>Remembered your password ?</CustomLink>
            <CustomButton type="submit" sx={{ marginTop: "0.4rem" }}>
              Submit
            </CustomButton>
          </MUI.Box>
        </MUI.Stack>
      </form>
    </MUI.Box>
  );
}
