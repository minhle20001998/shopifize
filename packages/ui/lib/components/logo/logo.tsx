import { Stack } from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useTheme } from "../../contexts";
import { CustomTypography } from "..";

export interface ILogoProps {
  size?: "sm" | "md" | "lg";
  hasLogo?: boolean
}

export const Logo = ({ size = "md", hasLogo = true }: ILogoProps) => {
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
    <Stack direction={"row"} alignItems="center">
      {hasLogo ? <LocalMallIcon
        sx={{
          fontSize: theme.customTypography.fontSizes.display1,
          transform: "rotate(-10deg)",
          color: theme.customPalette?.main,
        }}
      /> : <></>}
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
    </Stack>
  );
};
