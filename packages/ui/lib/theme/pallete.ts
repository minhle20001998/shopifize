import { ThemeOptions } from "@mui/material";

export interface PalleteTheme {
  main: string;
  main5: string;
  main10: string;
  main20: string;
  main40: string;
  main60: string;
  main80: string;
  main110: string;
  main120: string;
  main140: string;
  typeHeading: string;
  background: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundDarker: string;
  primaryText: string;
  secondaryText: string;
  contrastText: string;
  disabled: string;
  bodyDivider: string;
  inputBorder: string;
  inputHoverBorder: string;
  infoFill: string;
  errorFill: string;
  successFill: string;
  severeWarningFill: string;
  warningFill: string;
  infoStatus: string;
  errorStatus: string;
  successStatus: string;
  severeWarningStatus: string;
  warningStatus: string;
  overlayLight: string;
  overlayDark: string;
  overlayDisabled: string;
  white: string;
  grey10: string;
  grey20: string;
  grey30: string;
  grey40: string;
  grey50: string;
  grey60: string;
  grey70: string;
  grey80: string;
  grey90: string;
  grey100: string;
  grey110: string;
}


export const paletteLightTheme: PalleteTheme & ThemeOptions["palette"] = {
  main: "hsl(145, 99%, 35%)",
  main5: "hsl(145, 53%, 98%)",
  main10: "hsl(145, 53%, 94%)",
  main20: "hsl(145, 52%, 87%)",
  main40: "hsl(145, 52%, 74%)",
  main60: "hsl(145, 52%, 61%)",
  main80: "hsl(145, 57%, 48%)",
  main110: "hsl(145, 99%, 28%)",
  main120: "hsl(145, 98%, 17%)",
  main140: "hsl(145, 100%, 10%)",
  typeHeading: "#27272a",
  background: "#FFFFFF",
  backgroundPrimary: "#F5F5F6",
  backgroundSecondary: "#F0F0F0",
  backgroundDarker: "#EAEBEB",
  primaryText: "#27272a",
  secondaryText: "#605E5C",
  contrastText: "#FFFFFF",
  disabled: "#A19F9D",
  bodyDivider: "#EDEBE9",
  inputBorder: "#dbdbdb",
  inputHoverBorder: "#27272a",
  infoFill: "#CCECF8",
  errorFill: "#EFD9DB",
  successFill: "#D1E8CF",
  severeWarningFill: "#F0CBBE",
  warningFill: "#F8DB96",
  infoStatus: "#009EDA",
  errorStatus: "#A4262C",
  successStatus: "#107C10",
  severeWarningStatus: "#D83B01",
  warningStatus: "#EFB01D",
  overlayLight: "rgba(255, 255, 255, 0.4)",
  overlayDark: "rgba(0, 0, 0, 0.4)",
  overlayDisabled: "rgba(0, 0, 0, 0.04)",
  white: "#ffffff",
  grey10: "#FAF9F8",
  grey20: "#F3F2F1",
  grey30: "#EDEBE9",
  grey40: "#E1DFDD",
  grey50: "#D2D0CE",
  grey60: "#C8C6C4",
  grey70: "#A19F9D",
  grey80: "#605E5C",
  grey90: "#3B3A39",
  grey100: "#323130",
  grey110: "#201F1E",
};
