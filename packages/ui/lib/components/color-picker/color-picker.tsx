/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormControl, SxProps, Theme } from "@mui/material";
import { FormikProps} from "formik";
import { useEffect, useId, useState } from "react";
import { CustomTypography } from "..";
import { CustomHelperText } from "../helper-text";
import { useInputFormik } from "../../hooks/use-input-formik";

interface Props<T>  {
  name?: keyof T;
  arrayName?: string;
  label?: string;
  formik?: FormikProps<T>;
  helperText?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  errorMessage?: string | undefined | null;
  sx?: SxProps<Theme>
}

type CustomColorPickerProps<T> = Props<T> & React.InputHTMLAttributes<HTMLInputElement>

export const CustomColorPicker = <T,>(props: CustomColorPickerProps<T>) => {
  const {
    errorMessage,
    helperTextHidden,
    helperText,
    ref,
    formik,
    visuallyHidden,
    label,
    sx,
    arrayName,
    ...inputProps
  } = props
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // Update debouncedColor after the delay
      formik?.setFieldValue(inputName.toString(), selectedColor)
    }, 100); // Adjust the delay (in milliseconds) as needed

    // Cleanup the timeout on component unmount or when selectedColor changes
    return () => clearTimeout(debounceTimeout);
  }, [selectedColor]);

  let id = useId();
  const helperTextId = useId();
  id = inputProps.id ?? id;

  const { inputName, formikErrorMessage, isError, value } = useInputFormik<T, string>({
    name: inputProps.name?.toString(),
    arrayName,
    formik
  })

  return <Box sx={sx}>
    <FormControl error={isError} sx={{ width: "100%", ...sx }}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem", width: 'fit-content' }}
        htmlFor={id}
      >
        {label}
      </CustomTypography>
      <input
        id={id}
        value={value}
        ref={ref}
        type="color"
        onChange={(e) => {
          setSelectedColor(e.currentTarget.value)
        }}
        onBlur={formik?.handleBlur}
        aria-describedby={helperTextId}
        {...inputProps}
        name={inputName.toString()}
      />
      <CustomHelperText
        helperTextId={helperTextId}
        isError={isError}
        errorMessage={errorMessage}
        formikErrorMessage={formikErrorMessage}
        helperText={helperText}
        helperTextHidden={helperTextHidden}
        visuallyHidden={visuallyHidden}
      />
    </FormControl>
  </Box>
}