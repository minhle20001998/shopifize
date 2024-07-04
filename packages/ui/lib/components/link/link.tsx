import { Link, SxProps, Theme, styled } from "@mui/material";
import React from "react";
import { default as NextLink, LinkProps } from "next/link";
import { useTheme } from "../../contexts";

interface Props extends LinkProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  variant?: CustomLinkVariant;
  hoverStyle?: CustomHoverVariant;
}

export type CustomLinkVariant = "primary" | "secondary" | "grey" | "black";

export type CustomHoverVariant = "underline" | "color" | "none";

const MuiLink = styled(Link)(({ theme }) =>
  theme.unstable_sx({
    color: "common.white",
    fontSize: "14px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  })
);

export type CustomLinkProps = Props &
  Partial<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>>;

export const CustomLink = (props: CustomLinkProps) => {
  const {
    href,
    sx,
    children,
    variant = "primary",
    hoverStyle = "underline",
    ...delegated
  } = props;

  const theme = useTheme();

  const variantStyle: SxProps<Theme> = {
    color: () => {
      switch (variant) {
        default:
        case "primary":
          return theme.customPalette.main;
        case "secondary":
          return theme.customPalette.white;
        case "grey":
          return theme.customPalette.secondaryText;
        case "black":
          return theme.customPalette.primaryText
      }
    },
    "&:hover": () => {
      switch (hoverStyle) {
        default:
        case "underline":
          return {
            textDecoration: "underline",
          };
        case "color":
          return {
            textDecoration: "none",
            color:
              variant === "primary"
                ? "primary.hover"
                : theme.customPalette.main,
          };
        case "none":
          return {
            textDecoration: "none",
          };
      }
    },
  };

  return (
    <NextLink href={href} passHref legacyBehavior {...delegated}>
      <MuiLink sx={{ ...variantStyle, ...sx }}>{children}</MuiLink>
    </NextLink>
  );
};

CustomLink.displayName = "CustomLink";