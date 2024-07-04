import React, { useRef } from "react";
import useMobileScreen from "~/hooks/useMobileScreen";
import { CustomFooter } from "./footer";
import { CustomHeader } from "./header";
import { CustomNavbar } from "./navbar";
import { Roboto } from "@next/font/google";
import { MUI } from "@shopifize/ui";

export const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
});

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobileSize = useMobileScreen();

  const topHeaderRef = useRef<HTMLDivElement>(null);

  return (
    <MUI.Box className={roboto.className}>
      <MUI.Box
        ref={topHeaderRef}
        sx={{
          position: "sticky",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: 2,
          boxShadow: "0 0 8px #cfcfcf",
        }}
      >
        {isMobileSize ? <></> : <CustomNavbar />}
        <CustomHeader />
      </MUI.Box>
      <main>{children}</main>
      <CustomFooter />
    </MUI.Box>
  );
};
