import { CustomTypography, MUI } from "@shopifize/ui";
import React from "react";
import { useTheme } from "@shopifize/ui";

const Copyright = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();
  return (
    <MUI.Stack direction={"row"} justifyContent={"space-between"}>
      <CustomTypography
        fontSize={"body2"}
        sx={{
          color: theme.customPalette.white,
        }}
      >
        © {year} Shopifize. All Rights Reserved.
      </CustomTypography>
      <CustomTypography
        fontSize={"body2"}
        sx={{
          color: theme.customPalette.white,
          textAlign: "right",
        }}
      >
        Powered by Minklee
      </CustomTypography>
    </MUI.Stack>
  );
};

export default Copyright;
