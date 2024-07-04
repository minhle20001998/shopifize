/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  FormControlProps,
  IconButton,
  InputAdornment,
  OutlinedInputProps,
  SxProps,
  Theme,
} from "@mui/material";
import { FormikProps } from "formik";
import React, { useId, useState } from "react";
import { CustomTypography } from "../typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CustomHelperText } from "../helper-text";
import { BaseInput } from ".";
import { useInputFormik } from "../../hooks/use-input-formik";

interface Props<T> extends Omit<OutlinedInputProps, "name"> {
  //typesafe for formik
  name?: keyof T;
  arrayName?: string;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  innerInputSx?: SxProps<Theme>
}

type ICustomInputProps<T> = Props<T> &
  Omit<FormControlProps, keyof OutlinedInputProps>;

export const CustomInput = <T,>(props: ICustomInputProps<T>) => {
  const {
    errorMessage,
    formik,
    label,
    helperText,
    ref,
    visuallyHidden,
    helperTextHidden = false,
    sx,
    innerInputSx,
    type,
    arrayName,
    ...inputProps
  } = props;
  let id = useId();
  const helperTextId = useId();
  id = inputProps.id ?? id;
  // const inputName = arrayName ? arrayName : (inputProps.name as keyof T) ?? "";
  const [showPassword, toggleShowPassword] = useState(false);

  const handleClickShowPassword = () => toggleShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const isPasswordType = type === "password";

  const inputType = (() => {
    if (isPasswordType) {
      return showPassword ? "text" : "password";
    }
    return type;
  })();

  const { inputName, formikErrorMessage, isError, value } = useInputFormik({
    name: inputProps.name?.toString(),
    arrayName,
    formik
  })

  return (
    <FormControl error={isError} sx={{ width: "100%", ...sx }}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
        htmlFor={id}
      >
        {label}
      </CustomTypography>
      <BaseInput
        id={id}
        inputRef={ref}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        value={value}
        aria-describedby={helperTextId}
        endAdornment={
          isPasswordType ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{
                  padding: "0 8px",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : (
            <></>
          )
        }
        {...inputProps}
        sx={innerInputSx}
        type={inputType}
        name={inputName.toString()}
      />
      <CustomHelperText
        isError={isError}
        helperText={helperText}
        errorMessage={errorMessage}
        helperTextId={helperTextId}
        visuallyHidden={visuallyHidden}
        helperTextHidden={helperTextHidden}
        formikErrorMessage={formikErrorMessage}
      />
      {/* {isError ? (
        <FormHelperText
          id={helperTextId}
          sx={{ padding: 0, margin: 0, marginTop: "4px" }}
        >
          {errorMessage
            ? errorMessage
            : formikErrorMessage?.toString()}
        </FormHelperText>
      ) : (
        !helperTextHidden ? <Box sx={{ height: "24px" }}>
          <FormHelperText
            id={helperTextId}
            sx={{ padding: 0, margin: 0, marginTop: "4px" }}
            className={visuallyHidden ? "visually-hidden" : ""}
          >
            {helperText}
          </FormHelperText>
        </Box> : <></>
      )} */}
    </FormControl>
  );
};

CustomInput.displayName = "CustomInput";