import { Chip, ChipProps } from "@mui/material";
import { forwardRef } from "react";

export type CustomChipProps = ChipProps

export const CustomChip = forwardRef<HTMLDivElement, CustomChipProps>((props, ref) => {
  return (
    <Chip
      ref={ref}
      {...props}
      sx={{
        height: "28px",
        fontSize: (theme) => theme.customTypography.fontSizes.label1,
        ...props.sx,
      }}
    />
  );
});

CustomChip.displayName = "Custom Chip";