import { Checkbox, CheckboxProps, FormControlLabel } from "@mui/material"
import React from "react"
import { CustomTypography } from ".."

export const CustomCheckbox = React.forwardRef<HTMLButtonElement, CheckboxProps & { label?: string, hideLabel?: boolean }>((props, ref) => {
  const { label, hideLabel, ...checkboxProps } = props

  if (hideLabel) {
    return <Checkbox ref={ref} {...checkboxProps} />
  }

  return <FormControlLabel sx={{
    '& *': {
      fontFamily: 'unset'
    }
  }}
    control={<Checkbox ref={ref} {...checkboxProps} />}
    label={<CustomTypography>{label}</CustomTypography>}
    labelPlacement="end"
  />
})