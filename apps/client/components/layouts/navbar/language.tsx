import { LANGUAGES_KEYS } from "const/languages";
import Link from "next/link";
import React from "react";
import { navbarIconsStyle } from "./custom-navbar";
import { CustomTypography, MUI, MUIIcon } from "@shopifize/ui";

const LanguageChange = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        role={"button"}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MUI.Stack
          direction={"row"}
          gap={"4px"}
          alignItems={"center"}
          sx={{ cursor: "pointer" }}
        >
          <MUIIcon.Language sx={navbarIconsStyle} />
          <CustomTypography
            as={"span"}
            sx={{ color: "common.white", fontSize: "12px" }}
          >
            Languague
          </CustomTypography>
        </MUI.Stack>
      </div>
      <MUI.Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {LANGUAGES_KEYS.map((language) => {
          return (
            <Link key={language} href={"/"} locale={language} legacyBehavior>
              <MUI.MenuItem onClick={handleClose} sx={{ minWidth: "100px" }}>
                <CustomTypography sx={{ fontSize: "14px" }}>
                  {language}
                </CustomTypography>
              </MUI.MenuItem>
            </Link>
          );
        })}
      </MUI.Menu>
    </>
  );
};

export default LanguageChange;
