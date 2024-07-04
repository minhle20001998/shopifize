import React from "react";
import { MUI, useTheme } from "@shopifize/ui";

interface IContentTitleProps {
  isLeftSide?: boolean;
  children: React.ReactNode;
  sx?: React.CSSProperties;
}

const ContentTitle = ({ isLeftSide, children, sx }: IContentTitleProps) => {
  const theme = useTheme();

  return (
    <MUI.Stack
      direction={"row"}
      justifyContent={!isLeftSide ? "center" : "flex-start"}
      sx={{
        backgroundColor: theme.customPalette.background,
        padding: "10px 0",
        marginBottom: "12px",
        borderBottomStyle: !isLeftSide ? "solid" : undefined,
        borderBottomWidth: "4px",
        borderBottomColor: !isLeftSide ? theme.customPalette.main : undefined,
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        ...sx,
      }}
    >
      {children}
    </MUI.Stack>
  );
};

export default ContentTitle;
