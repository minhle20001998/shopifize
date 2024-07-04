import { default as NextLink } from "next/link";
import React from "react";
import Logo from "~/components/ui/logo";
import useMobileScreen from "~/hooks/useMobileScreen";
import ActionButtons from "./action-buttons";
import Searchbar from "./searchbar";
import { MUI } from "@shopifize/ui";

const CustomHeader = () => {
  const isMobileSize = useMobileScreen();

  return (
    <MUI.Stack
      sx={{
        minHeight: "80px",
        padding: {
          xs: "12px 0",
          sm: "12px 0",
          md: "12px 0",
          lg: "12px",
          xl: "12px",
        },
        backgroundColor: "common.white",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: "0 !important",
      }}
    >
      <MUI.Container
        sx={{
          height: "100%",
          paddingTop: {
            xs: "12px",
            sm: "12px",
            md: "12px",
            lg: "0",
            xl: "0",
          },
        }}
      >
        <MUI.Stack
          alignItems="center"
          justifyContent={"space-between"}
          sx={{
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
              xl: "row",
            },
            gap: {
              xs: "0rem",
              sm: "0rem",
              md: "8rem",
              lg: "5rem",
              xl: "5rem",
            },
          }}
        >
          <MUI.Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
            width={!isMobileSize ? "auto" : "100%"}
          >
            <NextLink href={"/"} style={{ textDecoration: "none" }}>
              <Logo size={"md"} />
            </NextLink>
            {!isMobileSize ? <></> : <ActionButtons />}
          </MUI.Stack>
          <MUI.Stack
            sx={{
              alignItems: {
                xs: "flex-end",
                sm: "flex-end",
                md: "center",
                lg: "center",
                xl: "center",
              },
              width: {
                xs: "100%",
                sm: "100%",
                md: "auto",
                lg: "auto",
                xl: "auto",
              },
            }}
            direction={"row"}
            gap={"1rem"}
            flex={1}
          >
            <Searchbar />
            {isMobileSize ? <></> : <ActionButtons />}
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Container>
    </MUI.Stack>
  );
};

export default CustomHeader;
