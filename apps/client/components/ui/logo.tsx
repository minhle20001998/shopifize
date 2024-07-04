import React from "react";
import { CustomTypography, MUI, MUIIcon, useTheme } from "@shopifize/ui";

interface ILogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({ size = "md" }: ILogoProps) => {
  const theme = useTheme();

  const fontSizeMap: Record<typeof size, { first: string; rest: string }> = {
    sm: {
      first: theme.customTypography.fontSizes.display3,
      rest: theme.customTypography.fontSizes.body1,
    },
    md: {
      first: theme.customTypography.fontSizes.display2,
      rest: theme.customTypography.fontSizes.header2,
    },
    lg: {
      first: "4rem",
      rest: theme.customTypography.fontSizes.display2,
    },
  };

  return (
    <MUI.Stack direction={"row"} alignItems="center">
      <MUIIcon.LocalMall
        sx={{
          fontSize: theme.customTypography.fontSizes.display1,
          transform: "rotate(-10deg)",
          color: theme.customPalette?.main,
        }}
      />
      <CustomTypography
        sx={{
          fontFamily: "cursive",
          fontSize: fontSizeMap[size].first,
          fontWeight: "bold",
          letterSpacing: "0.05rem",
          color: theme.customPalette?.main,
        }}
      >
        S
      </CustomTypography>
      <CustomTypography
        sx={{
          fontFamily: "cursive",
          fontSize: fontSizeMap[size].rest,
          letterSpacing: "0.05rem",
          textDecoration: "underline",
          color: theme.customPalette?.main,
        }}
      >
        hopifize
      </CustomTypography>
    </MUI.Stack>
  );
};

export default Logo;
