import React from "react";
import CategoriesGrid from "./categories";
import Copyright from "./copyright";
import Information from "./information";
import Intro from "./intro";
import { MUI, useTheme } from "@shopifize/ui";

const CustomFooter = () => {
  const theme = useTheme();

  return (
    <footer>
      <MUI.Box
        sx={{ backgroundColor: theme.customPalette.white, padding: "2rem 0" }}
      >
        <MUI.Container>
          <Intro />
        </MUI.Container>
      </MUI.Box>
      <MUI.Box
        sx={{
          backgroundColor: theme.customPalette.white,
          padding: "2rem 0",
          borderTop: `1px solid ${theme.customPalette.bodyDivider}`,
        }}
      >
        <MUI.Container>
          <CategoriesGrid />
        </MUI.Container>
      </MUI.Box>
      <MUI.Box
        sx={{
          backgroundColor: theme.customPalette.white,
          padding: "2rem 0",
          borderTop: `1px solid ${theme.customPalette.bodyDivider}`,
        }}
      >
        <MUI.Container>
          <Information />
        </MUI.Container>
      </MUI.Box>
      <MUI.Box
        sx={{
          backgroundColor: theme.customPalette.main,
          padding: "0.5rem 0",
          borderTop: `1px solid ${theme.customPalette.bodyDivider}`,
        }}
      >
        <MUI.Container>
          <Copyright />
        </MUI.Container>
      </MUI.Box>
    </footer>
  );
};

export default CustomFooter;
