import { FormControl, MenuItem, Select, SelectProps, SxProps, Theme } from "@mui/material";
import { FormikProps } from "formik";
import React, { useId } from "react";
import { CustomTypography } from "..";
import { CustomHelperText } from "../helper-text";

export interface Options {
  id: string | number
  label: string
}

interface Props<T> {
  name?: keyof T;
  options?: Options[];
  label?: string;
  formik?: FormikProps<T>;
  helperText?: string;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  errorMessage?: string | undefined | null;
  innerInputSx?: SxProps<Theme>;
  placeholderOption?: Options
}

type CustomSelectProps<T> = Props<T> & Omit<SelectProps, keyof Props<T>>

export const CustomSelect = <T,>(props: CustomSelectProps<T>) => {
  const {
    options,
    errorMessage,
    helperTextHidden,
    helperText,
    ref,
    formik,
    visuallyHidden,
    label,
    innerInputSx,
    sx,
    placeholderOption,
    ...selectProps
  } = props
  let id = useId();
  const helperTextId = useId();
  id = selectProps.id ?? id;
  const inputName = (selectProps.name as keyof T) ?? "";

  const isError =
    formik?.errors?.[inputName] && formik?.touched?.[inputName] ? true : false;

  return <>
    <FormControl error={isError} sx={{ width: "100%", ...sx }}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
        htmlFor={id}
      >
        {label}
      </CustomTypography>
      <Select
        id={id}
        ref={ref}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        value={!props.multiple ? formik?.values?.[inputName] : formik?.values?.[inputName] ? formik?.values?.[inputName] : []}
        aria-describedby={helperTextId}
        sx={{
          '& .MuiSelect-select': {
            paddingLeft: '10px'
          },
          '& fieldset': {
            border: '1px solid rgba(0,0,0,.14)'
          },
          height: "40px",
          fontSize: "14px",
          ...innerInputSx
        }}
        {...selectProps}
        name={inputName.toString()}
      >
        {placeholderOption && <MenuItem value={placeholderOption.id} disabled>
          {placeholderOption.label}
        </MenuItem>}
        {options && options.length > 0 ? options?.map((option) => {
          return <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
        }) : <MenuItem disabled>No data</MenuItem>}
      </Select>
      <CustomHelperText
        helperTextId={helperTextId}
        isError={isError}
        errorMessage={errorMessage}
        formikErrorMessage={formik?.errors?.[inputName]?.toString()}
        helperText={helperText}
        helperTextHidden={helperTextHidden}
        visuallyHidden={visuallyHidden}
      />
    </FormControl>
  </>
}
