import { Box, FormControl, FormHelperText, InputAdornment, OutlinedInput, OutlinedInputProps, SxProps, Theme, styled } from "@mui/material";
import { useLocale } from "@react-aria/i18n";
import { AriaNumberFieldProps, useNumberField } from "@react-aria/numberfield";
import { NumberFieldStateOptions, useNumberFieldState } from "@react-stately/numberfield";
import { FormikProps, getIn } from "formik";
import React, { useEffect, useId, useMemo } from "react";
import { CustomIconButton, CustomTypography } from "..";
import { isNil } from "@shopifize/helpers";
import { Add, Remove } from "@mui/icons-material";

const Input = styled(OutlinedInput)(({ theme }) =>
  theme.unstable_sx({
    "& input": {
      padding: "10px",
    },
    "& fieldset": {
      border: "1px solid rgba(0,0,0,.14)",
    },
    fontSize: "14px",
  })
);

interface Props<T> {
  name?: keyof T;
  sx?: SxProps<Theme>;
  arrayName?: string;
  label?: string;
  onValueChange?: (value: number) => void;
  helperText?: string;
  formik?: FormikProps<T>;
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
  errorMessage?: string | undefined | null;
  innerInputSx?: SxProps<Theme>;
  showHelperButton?: boolean
}

export type NumberInputProps<T> = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & Props<T>

export const NumberInput = <T,>(props: NumberInputProps<T>) => {
  const {
    label,
    sx,
    onValueChange,
    arrayName,
    formik,
    visuallyHidden,
    value: controlledValue,
    errorMessage,
    helperTextHidden,
    helperText,
    innerInputSx,
    disabled,
    showHelperButton = true,
    ...numberInputProps
  } = props;
  const { locale } = useLocale();
  const inputName = arrayName ? arrayName : (props.name as keyof T) ?? "";
  let id = useId();
  const helperTextId = useId();
  id = props.id ?? id;

  const value = useMemo(() => {
    if (controlledValue) {
      return controlledValue
    }
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.values?.[iName]
    } else {
      const iName = inputName as string
      const value = getIn(formik?.values, iName)
      return value
    }
  }, [arrayName, formik?.values, inputName, controlledValue])

  const state = useNumberFieldState({
    ...numberInputProps, value: value, locale
  } as NumberFieldStateOptions);

  useEffect(() => {
    const value = isNaN(state.numberValue) ? 0 : state.numberValue
    onValueChange?.(value)
    formik?.setFieldValue(inputName.toString(), value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.numberValue])

  const inputRef = React.useRef(null);
  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField(props as AriaNumberFieldProps, state, inputRef);

  const isError = useMemo(() => {
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.errors?.[iName] && formik?.touched?.[iName] ? true : false;
    } else {
      const iName = inputName as string
      const error = getIn(formik?.errors, iName)
      const touched = getIn(formik?.touched, iName)
      return error && touched ? true : false
    }
  }, [arrayName, formik?.errors, formik?.touched, inputName])

  const formikErrorMessage = useMemo(() => {
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.errors?.[iName]?.toString()
    } else {
      const iName = inputName as string
      const value = getIn(formik?.errors, iName) as string
      return value
    }
  }, [arrayName, formik?.errors, inputName])


  const handleIncrement = () => {
    formik?.setFieldTouched(inputName.toString(), true)
    if (isNil(value)) {
      state.increment()
    } else {
      formik?.setFieldValue(inputName.toString(), value + 1)
    }
  }

  const handleDecrement = () => {
    formik?.setFieldTouched(inputName.toString(), true)
    if (isNil(value)) {
      state.increment()
    } else {
      formik?.setFieldValue(inputName.toString(), value - 1)
    }
  }



  return (
    <FormControl error={isError} sx={{ width: "fit-content" }}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
        {...labelProps}
        htmlFor={id}
      >
        {label}
      </CustomTypography>
      <Box sx={sx} {...groupProps}>
        <Input
          id={id}
          {...inputProps as OutlinedInputProps}
          sx={{
            ...innerInputSx,
            width: '100%',
            '& input': {
              padding: showHelperButton ? '10px' : '0px',
              textAlign: 'center'
            }
          }}
          name={inputName.toString()}
          aria-describedby={helperTextId}
          onBlur={formik?.handleBlur}
          inputRef={inputRef}
          disabled={disabled}
          startAdornment={
            showHelperButton ? <InputAdornment position="start">
              <CustomIconButton
                {...decrementButtonProps}
                onClick={handleDecrement}
                aria-label="decrease value"
                edge="start"
                disabled={disabled}
              >
                <Remove />
              </CustomIconButton>
            </InputAdornment> : <></>
          }
          endAdornment={
            showHelperButton ? <InputAdornment position="end">
              <CustomIconButton
                {...incrementButtonProps}
                onClick={handleIncrement}
                aria-label="increase value"
                edge="end"
                disabled={disabled}
              >
                <Add />
              </CustomIconButton>
            </InputAdornment> : <></>
          }
        />
      </Box>
      {isError && !helperTextHidden ? (
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
      )}
    </FormControl>
  );
}