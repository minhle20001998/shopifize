import {
  PaletteMode,
  Theme,
  createTheme,
  ThemeProvider as MUIThemeProvider,
  useTheme as useMuiTheme,
} from "@mui/material";
import React, { createContext, useContext } from "react";
import { getDesignTokens } from "../theme";
// import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';
// ClassNameGenerator.configure((componentName) => `shopifized-${componentName}`)
// import getDesignTokens from "~/styles/tconsole.dir(first)heme/globalTheme";

// interface IThemeContext {}

const ThemeContext = createContext<() => void>(() => {});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const toggleColorMode = () => {
    setMode((prevMode: PaletteMode) =>
      prevMode === "light" ? "dark" : "light"
    );
  };

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={toggleColorMode}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeToggle = () => {
  return useContext(ThemeContext);
};

export const useTheme = () => {
  return useMuiTheme<Theme>();
};

