import {
  Box,
  FormControl,
  FormControlProps,
  FormHelperText,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import { FormikProps } from "formik";
import { CustomTypography } from "../typography";
import { useId } from "react";
import ReactPhoneInput from "react-phone-input-material-ui";
interface Props<T> extends Omit<OutlinedInputProps, "name"> {
  //typesafe for formik
  name?: keyof T;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  visuallyHidden?: boolean;
}

type ICustomPhoneInputProps<T> = Props<T> &
  Omit<FormControlProps, keyof OutlinedInputProps>;

export const CustomPhoneInput = <T,>(props: ICustomPhoneInputProps<T>) => {
  const {
    ref,
    visuallyHidden,
    label,
    sx,
    formik,
    errorMessage,
    helperText,
    ...inputProps
  } = props;
  let id = useId();
  const helperTextId = useId();
  id = inputProps.id ?? id;
  const inputName = (inputProps.name as keyof T) ?? "";

  const isError =
    formik?.errors?.[inputName] && formik?.touched?.[inputName] ? true : false;

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
      <ReactPhoneInput
        country={"vn"}
        onChange={(value) => formik?.setFieldValue(inputName.toString(), value)}
        onBlur={formik?.handleBlur}
        value={String(formik?.values?.[inputName])}
        aria-describedby={helperTextId}
        inputProps={{
          ref: ref,
          ...inputProps,
          id: id,
          label: "",
          name: inputName.toString(),
          error: isError,
        }}
        disableDropdown
        component={OutlinedInput}
      />
      {isError ? (
        <FormHelperText
          id={helperTextId}
          sx={{ padding: 0, margin: 0, marginTop: "4px" }}
        >
          {errorMessage
            ? errorMessage
            : formik?.errors?.[inputName]?.toString()}
        </FormHelperText>
      ) : (
        <Box sx={{ height: "24px" }}>
          <FormHelperText
            id={helperTextId}
            sx={{ padding: 0, margin: 0, marginTop: "4px" }}
            className={visuallyHidden ? "visually-hidden" : ""}
          >
            {helperText}
          </FormHelperText>
        </Box>
      )}
    </FormControl>
  );
};