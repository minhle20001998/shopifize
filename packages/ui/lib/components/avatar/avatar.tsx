import { Avatar, AvatarProps } from "@mui/material";
import React from "react";

export const CustomAvatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    return <Avatar {...props} ref={ref} />;
  }
);

CustomAvatar.displayName = "Avatar";