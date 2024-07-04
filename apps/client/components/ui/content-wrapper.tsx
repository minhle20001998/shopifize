import { MUI, SxProps, Theme, useTheme } from "@shopifize/ui";
import React from "react";

interface IContentWrapperProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  isTransparent?: boolean;
}

const ContentWrapper = (props: IContentWrapperProps) => {
  const theme = useTheme();

  return (
    <MUI.Box
      sx={{
        padding: props.isTransparent ? "12px 0" : "12px 16px",
        backgroundColor: props.isTransparent
          ? "transparent"
          : theme.customPalette.background,
        borderRadius: "4px",
        ...props.sx,
      }}
    >
      {props.children}
    </MUI.Box>
  );
};

export default ContentWrapper;
