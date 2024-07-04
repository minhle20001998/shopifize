import {
  FormControl,
  FormControlProps,
  TextareaAutosize,
  TextareaAutosizeProps,
  styled,
} from "@mui/material";
import { FormikProps } from "formik";
import { useId } from "react";
import { useInputFormik } from "../../hooks/use-input-formik";
import { CustomTypography } from "../typography";
import { CustomHelperText } from "../helper-text";

interface Props<T> extends Omit<TextareaAutosizeProps, "name"> {
  name?: keyof T;
  arrayName?: string;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  isError?: boolean
  visuallyHidden?: boolean;
  helperTextHidden?: boolean;
}

type ICustomTextareaProps<T> = Props<T> &
  Omit<FormControlProps, keyof TextareaAutosizeProps>;

export const CustomTextarea = <T,>(props: ICustomTextareaProps<T>) => {
  const {
    errorMessage,
    formik,
    label,
    helperText,
    ref,
    visuallyHidden,
    helperTextHidden = false,
    sx,
    arrayName,
    name,
    isError: isErrorProp,
    ...inputProps
  } = props;
  let id = useId();
  const helperTextId = useId();
  id = inputProps.id ?? id;

  const { inputName, formikErrorMessage, isError, value } = useInputFormik({
    name: name?.toString(),
    arrayName,
    formik,
    isError: isErrorProp
  });

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
      <Textarea
        id={id}
        ref={ref}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        value={value as string}
        aria-describedby={helperTextId}
        {...inputProps}
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
    </FormControl>
  );
};

const Textarea = styled(TextareaAutosize)(({ theme }) =>
  theme.unstable_sx({
    boxSizing: "border-box",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "0.875rem",
    width: '100%',
    fontWeight: 400,
    lineHeight: 1.5,
    borderRadius: theme.borderRadius[4],
    padding: '0.625rem',
    borderColor: theme.customPalette.inputBorder,
    resize: 'vertical',
    minHeight: '40px',
    '&:focus-visible': {
      outlineColor: theme.customPalette.main
    }
  })
);
