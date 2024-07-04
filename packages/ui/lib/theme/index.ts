import { PaletteMode, ThemeOptions } from "@mui/material";
import { PalleteTheme, paletteLightTheme } from "./pallete";
import { typography } from "./typography";
import { boxShadows } from "./box-shadow";
import { borderRadius } from "./border-radius";
import { fontWeight } from "./font-weight";
import { LinkBehaviour } from "../components";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const customPalette =
    mode === "light" ? paletteLightTheme : paletteLightTheme;

  return {
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    palette: {
      primary: {
        main: customPalette.main,
        contrastText: customPalette.white,
      },
      text: {
        primary: customPalette.primaryText,
        secondary: customPalette.secondaryText,
        disabled: customPalette.disabled,
      },
    },
    customPalette: {
      mode,
      ...customPalette,
    },
    customTypography: typography,
    boxShadows,
    borderRadius,
    fontWeight,
    components: {
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehaviour,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&": {
              height: "40px",
              fontSize: "14px",
              backgroundColor: customPalette.background
            },
            "&.Mui-disabled": {
              backgroundColor: customPalette.overlayDisabled,
            },
            "&.Mui-disabled fieldset": {
              border: `1px solid ${customPalette.grey20} !important`,
            },
          },
        },
      },
    },
  };
};

type CustomTheme = {
  customTypography: typeof typography;
  customPalette: PalleteTheme;
  boxShadows: typeof boxShadows;
  borderRadius: typeof borderRadius;
  fontWeight: typeof fontWeight;
};

declare module "@mui/material/styles/createTheme" {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends Partial<CustomTheme> {}
}