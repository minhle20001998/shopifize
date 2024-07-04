import { IconButton, IconButtonProps } from "@mui/material";
import React from "react";

type Props = IconButtonProps;

export const CustomIconButton = React.forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { type = "button", children, ...delegated } = props;

    return (
      <IconButton {...delegated} ref={ref} type={type}>
        {children}
      </IconButton>
    );
  }
);

CustomIconButton.displayName = "CustomButton";

