import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@mui/material";
import { useId } from "react";
import { CustomTypography } from "../typography";
import { FormikProps } from "formik";

interface Props<T> extends Omit<RadioGroupProps, "name"> {
  name?: keyof T;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  helperTextHidden?: boolean;
  visuallyHidden?: boolean;
  options?: Partial<FormControlLabelProps>[];
  direction?: "row" | "column";
}

export const CustomRadio = <T,>(props: Props<T>) => {
  const {
    visuallyHidden,
    label,
    ref,
    formik,
    errorMessage,
    helperText,
    options,
    direction = "row",
    name,
    helperTextHidden,
    ...groupRadioProps
  } = props;
  const helperTextId = useId();
  const inputName = (name as keyof T) ?? "";
  const isError =
    formik?.errors?.[inputName] && formik?.touched?.[inputName] ? true : false;

  const radioGroupDirection =
    direction === "column" ? { column: true } : { row: true };
  return (
    <FormControl ref={ref}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
      >
        {label}
      </CustomTypography>
      <RadioGroup
        {...radioGroupDirection}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        value={formik?.values?.[inputName]}
        aria-describedby={helperTextId}
        {...groupRadioProps}
        name={inputName.toString()}
      >
        {options?.map((option) => {
          const { value, label, ...radioProps } = option;
          return (
            <FormControlLabel
              key={String(value).toString()}
              value={value}
              label={label}
              {...radioProps}
              control={<Radio />}
              sx={{
                "& .css-ahj2mt-MuiTypography-root": {
                  fontSize: (theme) => theme.customTypography.fontSizes.body2,
                },
              }}
            />
          );
        })}
      </RadioGroup>
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
        !helperTextHidden ?  <Box sx={{ height: "24px" }}>
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
};

CustomRadio.displayName = "Custom Radio";