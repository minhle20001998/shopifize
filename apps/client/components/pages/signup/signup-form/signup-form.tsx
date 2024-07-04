import { useFormik } from "formik";
import { CSSProperties, useRef } from "react";
import * as Yup from "yup";
import Router from "next/router";
import { EMAIL_DUPLICATED, ResponseType } from "@shopifize/helpers";
import { useAuthQuery } from "queries";
import {
  CustomInput,
  CustomLink,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .matches(/\d/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Password Is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Confirm Passwords must match")
    .required("Confirm Password Required"),
});

export type SignupValueType = Yup.InferType<typeof validationSchema>;

export const IconProps: CSSProperties = {
  width: "20px",
  height: "20px",
  color: "#252525",
};

export const SignupForm = () => {
  const theme = useTheme();

  const onSignupSuccess = ({ error }: ResponseType<null>) => {
    if (error?.message === EMAIL_DUPLICATED) {
      formik.setErrors({ email: "This email is already in use" });
      emailInputRef.current?.focus();
      emailInputRef.current?.select();
      return;
    }
    enqueueSnackbar("Account signup successfully", { variant: "success" });
    void Router.push("/login");
  };

  const { signup, enqueueSnackbar } = useAuthQuery();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const initialValues: SignupValueType = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values: SignupValueType) => {
    signup.mutate(values, { onSuccess: onSignupSuccess });
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
        padding: "1rem 1rem 2rem 1rem",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <MUI.Stack gap={"1rem"}>
          <CustomTypography
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Sign Up
          </CustomTypography>
          <MUI.Stack gap={"0.5rem"} sx={{ marginTop: "16px" }}>
            <CustomInput
              variant="standard"
              placeholder="Email"
              name="email"
              type="email"
              aria-required
              startAdornment={<MUIIcon.Email sx={IconProps} />}
              formik={formik}
              ref={emailInputRef}
              visuallyHidden
            />
            <CustomInput
              variant="standard"
              name="password"
              placeholder="Password"
              type={"password"}
              startAdornment={<MUIIcon.Lock sx={IconProps} />}
              aria-required
              formik={formik}
              visuallyHidden
            />
            <CustomInput
              variant="standard"
              placeholder="Confirm Password"
              name="confirmPassword"
              type={"password"}
              aria-required
              formik={formik}
              startAdornment={<MUIIcon.LockReset sx={IconProps} />}
              visuallyHidden
            />
          </MUI.Stack>
          <MUI.Box sx={{ marginTop: "12px" }}>
            <MUI.Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ marginBottom: "0.4rem" }}
            >
              <CustomLink
                href={"/"}
                sx={{ color: theme.customPalette.main, fontSize: "14px" }}
              >
                Terms & Conditions
              </CustomLink>
              <CustomLink
                href={"/login"}
                sx={{ color: theme.customPalette.main, fontSize: "14px" }}
              >
                Already have an account ?
              </CustomLink>
            </MUI.Stack>
            <MUI.Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={signup.isLoading}
            >
              Sign up
            </MUI.Button>
          </MUI.Box>
        </MUI.Stack>
      </form>
    </MUI.Box>
  );
};
