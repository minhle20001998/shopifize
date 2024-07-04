"use-client";

import React, { useRef, useState } from "react";
import useMobileScreen from "~/hooks/useMobileScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import { useAuthQuery, useProfileQuery } from "queries";
import Router from "next/router";
import { useTheme } from "@shopifize/ui";
import {
  CustomButton,
  CustomIconButton,
  CustomLink,
  CustomTypography,
  MUI,
  MUIIcon,
  TooltipProps,
} from "@shopifize/ui";
import { Cart } from "./cart";

const actionButtonLinkStyle = {
  fontSize: "16px",
};

type LocalStorageReminder = {
  date: string;
  token?: string;
};

const ActionButtons = () => {
  const theme = useTheme();
  const { isAuthen, isCheckingAuthen } = useAuthContext();
  const { profile } = useProfileQuery();

  const isMobileSize = useMobileScreen();

  return (
    <MUI.Stack direction={"row"} alignItems={"center"} gap={"0.6rem"}>
      <Cart />
      {isAuthen && !isCheckingAuthen ? (
        // if log in
        <MUI.Stack direction={"row"} alignItems={"center"} gap={"4px"}>
          <AvatarIcon />
          {!isMobileSize ? (
            <>
              <CustomTypography sx={{ fontSize: "0.9rem", color: "#888888" }}>
                Hello
              </CustomTypography>
              <CustomTypography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: theme.customPalette.main,
                }}
              >
                {profile?.fullName} !
              </CustomTypography>
            </>
          ) : (
            <></>
          )}
        </MUI.Stack>
      ) : !isMobileSize ? (
        // if not login and not in mobile size
        <MUI.Stack direction="row" spacing={2}>
          <CustomLink
            href={"/login"}
            sx={actionButtonLinkStyle}
            variant="primary"
            hoverStyle="color"
          >
            Login
          </CustomLink>
          <CustomLink
            href={"/signup"}
            sx={actionButtonLinkStyle}
            variant="primary"
            hoverStyle="color"
          >
            Sign up
          </CustomLink>
        </MUI.Stack>
      ) : (
        // if not login and in mobile size
        <AvatarIcon />
      )}
    </MUI.Stack>
  );
};

const LightTooltip = MUI.styled(({ className, ...props }: TooltipProps) => (
  <MUI.Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${MUI.tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[3],
    padding: "0.5rem",
  },
}));

const AvatarIcon = () => {
  const theme = useTheme();
  const { isAuthen, isProfileEmpty } = useAuthContext();
  const { profile } = useProfileQuery();
  const { logout } = useAuthQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const decideToOpenReminder = () => {
    if (typeof window === "undefined") {
      return;
    }
    const localItem = localStorage.getItem("profile-remind");
    const lastTimeReminder = localItem
      ? (JSON.parse(localItem) as LocalStorageReminder)
      : null;

    //If has profile -> no need to remind
    if (isAuthen && !isProfileEmpty?.()) {
      return false;
    }

    //If has profile -> no need to remind

    //If no local storage reminder counter & no profile -> remind
    if (!lastTimeReminder && isProfileEmpty?.()) {
      return true;
    }
    // If has local storage reminder counter & no profile
    else if (lastTimeReminder && isProfileEmpty?.()) {
      const lastTimeReminderToDate = new Date(
        lastTimeReminder.date
      ).getMilliseconds();
      const now = new Date().getMilliseconds();
      const isMoreThanOneWeek = now - lastTimeReminderToDate >= 6.048e8;
      // If last remider is more than a week -> remind
      if (isMoreThanOneWeek) {
        return true;
      }
      // If last remider is more than a week -> no need to remind
      else {
        return false;
      }
    }
  };

  const [remindOpen, setRemindOpen] = useState(decideToOpenReminder);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const avatarRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <LightTooltip
        PopperProps={{
          disablePortal: true,
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        open={remindOpen}
        title={
          <>
            <CustomTypography>
              You don&apos;t have your profile set up yet, update now
            </CustomTypography>
            <MUI.Stack direction={"row"} gap={"0.5rem"} marginTop={"0.5rem"}>
              <CustomButton sx={{ textTransform: "none" }} href="/profile/me">
                Go to profile
              </CustomButton>
              <CustomButton
                sx={{ textTransform: "none" }}
                variant="outlined"
                onClick={() => {
                  localStorage.setItem(
                    "profile-remind",
                    JSON.stringify({
                      date: Date.now().toString(),
                      token: profile?.id,
                    } as LocalStorageReminder)
                  );
                  setRemindOpen(false);
                }}
              >
                Remind later
              </CustomButton>
            </MUI.Stack>
          </>
        }
        onClose={() => {
          setRemindOpen(false);
        }}
      >
        <CustomIconButton
          aria-label="Account menu"
          sx={{
            "&:hover .account-circle-icon": {
              color: theme.customPalette.main,
            },
          }}
          onClick={(e) => {
            handleClick(e);
          }}
          ref={avatarRef}
        >
          <MUIIcon.AccountCircle className="account-circle-icon" />
        </CustomIconButton>
      </LightTooltip>
      <MUI.Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiList-root": {
            minWidth: "160px",
          },
        }}
      >
        <CustomLink
          sx={{ fontSize: "14px" }}
          href="/profile/me"
          hoverStyle="none"
          variant="grey"
        >
          <MUI.MenuItem onClick={handleClose}>
            <MUI.ListItemIcon>
              <MUIIcon.AccountCircle fontSize="small" />
            </MUI.ListItemIcon>
            <CustomTypography fontSize={"body2"}>Profile</CustomTypography>
          </MUI.MenuItem>
        </CustomLink>
        <MUI.MenuItem onClick={handleClose}>
          <MUI.ListItemIcon>
            <MUIIcon.Settings fontSize="small" />
          </MUI.ListItemIcon>
          <CustomTypography fontSize={"body2"}>Settings</CustomTypography>
        </MUI.MenuItem>
        <MUI.MenuItem
          onClick={() => {
            logout.mutate();
            Router.reload();
            handleClose();
          }}
        >
          <MUI.ListItemIcon>
            <MUIIcon.Logout fontSize="small" />
          </MUI.ListItemIcon>
          <CustomTypography fontSize={"body2"}>Logout</CustomTypography>
        </MUI.MenuItem>
      </MUI.Menu>
    </>
  );
};

export default ActionButtons;
