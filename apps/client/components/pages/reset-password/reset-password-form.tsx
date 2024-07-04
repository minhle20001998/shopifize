import React, { useState } from "react";
import { IconProps } from "../signup";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuthQuery } from "queries";
import { useRouter } from "next/router";
import {
  CustomButton,
  CustomIconButton,
  CustomInput,
  CustomLink,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";
import { ResponseType } from "@shopifize/helpers";

const validationSchema = Yup.object().shape({
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

export type ResetPasswordValueType = Yup.InferType<typeof validationSchema>;

export function ResetPasswordForm() {
  const theme = useTheme();
  const [showPassword, toggleShowPassword] = useState(false);
  const [showConfirmPassword, toggleConfirmPassword] = useState(false);

  const resetPasswordOnSuccess = ({ success, error }: ResponseType<null>) => {
    if (success) {
      enqueueSnackbar("Your account password has been reset", {
        variant: "success",
      });
      void router.push("/login");
    } else {
      enqueueSnackbar(error?.message, {
        variant: "error",
      });
      void router.push("/forget-password");
    }
  };

  const { resetPassword, enqueueSnackbar } = useAuthQuery();
  const router = useRouter();

  const handleClickShowPassword = () => toggleShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    toggleConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const initialValues: ResetPasswordValueType = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values: ResetPasswordValueType) => {
    const token = router.query.token?.toString() ?? "";
    resetPassword.mutate(
      { token: token, password: values.password },
      { onSuccess: resetPasswordOnSuccess }
    );
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const isDisabled = resetPassword.isLoading || resetPassword.isSuccess;
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
        <MUI.Stack gap={"1rem"}>
          <CustomTypography
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Reset password
          </CustomTypography>
          <MUI.Stack gap={"0.5rem"} sx={{ marginTop: "16px" }}>
            <CustomInput
              formik={formik}
              aria-required
              variant="standard"
              placeholder="New password"
              type={showPassword ? "text" : "password"}
              name="password"
              label="New password"
              helperText="Enter your new password"
              endAdornment={
                <MUI.InputAdornment position="end">
                  <CustomIconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{
                      padding: "0 8px",
                    }}
                  >
                    {showPassword ? (
                      <MUIIcon.VisibilityOff />
                    ) : (
                      <MUIIcon.Visibility />
                    )}
                  </CustomIconButton>
                </MUI.InputAdornment>
              }
              startAdornment={<MUIIcon.Lock sx={IconProps} />}
              visuallyHidden
            />
            <CustomInput
              formik={formik}
              aria-required
              variant="standard"
              placeholder="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirm new password"
              helperText="Enter your password for login"
              endAdornment={
                <MUI.InputAdornment position="end">
                  <CustomIconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                    sx={{
                      padding: "0 8px",
                    }}
                  >
                    {showConfirmPassword ? (
                      <MUIIcon.VisibilityOff />
                    ) : (
                      <MUIIcon.Visibility />
                    )}
                  </CustomIconButton>
                </MUI.InputAdornment>
              }
              startAdornment={<MUIIcon.Lock sx={IconProps} />}
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
                href={""}
                sx={{ color: theme.customPalette.main, fontSize: "14px" }}
              >
                Remember your password ? Login now
              </CustomLink>
            </MUI.Stack>
            <CustomButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={isDisabled}
            >
              Submit
            </CustomButton>
          </MUI.Box>
        </MUI.Stack>
      </form>
    </MUI.Box>
  );
}
