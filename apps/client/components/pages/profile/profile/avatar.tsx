import { ScreenSize } from "const/screen-size";
import React, { useState } from "react";
import {
  AvatarProps,
  CustomAvatar,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";
import useMobileScreen from "~/hooks/useMobileScreen";

const AvatarProfile = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    const [isHovering, setHover] = useState(false);
    const { children, src, ...delegated } = props;
    const theme = useTheme();
    const isMobile = useMobileScreen(ScreenSize.sm);

    const avatarSize = isMobile ? "5.5rem" : "6.25rem";

    return (
      <MUI.Box
        sx={{
          position: "relative",
          "&:hover>div::before": {
            opacity: 1,
          },
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false);
        }}
      >
        <CustomAvatar
          {...delegated}
          src={src}
          ref={ref}
          sx={{
            fontSize: theme.customTypography.fontSizes.header1,
            width: avatarSize,
            height: avatarSize,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: theme.customPalette.overlayDark,
              opacity: 0,
              transition: "opacity 0.3s ease",
            },
            cursor: "pointer",
          }}
        >
          {!src ? children : <></>}
        </CustomAvatar>
        {isHovering ? (
          <MUIIcon.CameraAlt
            sx={{
              fontSize: theme.customTypography.fontSizes.header1,
              color: theme.customPalette.white,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 1,
              cursor: "pointer",
            }}
          />
        ) : (
          <></>
        )}
      </MUI.Box>
    );
  }
);

AvatarProfile.displayName = "Avatar";

export default AvatarProfile;
