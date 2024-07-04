import React from "react";
import LanguageChange from "./language";
import { CustomLink, CustomTypography, MUI, MUIIcon } from "@shopifize/ui";

const NavbarWrapper = MUI.styled("nav")(({ theme }) =>
  theme.unstable_sx({
    backgroundColor: theme.customPalette?.main,
  })
);

export const navbarIconsStyle = {
  fontSize: "20px",
  color: "common.white",
};

const CustomNavbar = () => {
  const navlinks = [
    { name: "Customer care", link: "" },
    { name: "Track my order", link: "" },
    { name: "Download", link: "" },
  ];

  return (
    <NavbarWrapper sx={{}}>
      <MUI.Container sx={{ padding: "4px 0" }}>
        <MUI.Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <MUI.Stack direction={"row"} gap={"12px"}>
            {navlinks.map((link, index) => (
              <CustomLink href={link.link} key={index} variant="secondary">
                {link.name}
              </CustomLink>
            ))}
          </MUI.Stack>
          <MUI.Stack direction={"row"} gap={"16px"} alignItems={"center"}>
            <CustomLink href={"#"} variant="secondary">
              <MUI.Stack direction={"row"} gap={"4px"} alignItems={"center"}>
                <MUIIcon.HelpOutlineOutlined sx={navbarIconsStyle} />
                <CustomTypography
                  as={"span"}
                  sx={{ color: "common.white", fontSize: "12px" }}
                >
                  Help
                </CustomTypography>
              </MUI.Stack>
            </CustomLink>
            <LanguageChange />
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Container>
    </NavbarWrapper>
  );
};

export default CustomNavbar;
