import React from "react";
import { LinkProps } from "next/link";
import { CustomLink, useTheme } from "@shopifize/ui";

export interface CategoryLinkProps extends LinkProps {
  children?: React.ReactNode;
  isTitle?: boolean;
}

const FooterLink = (props: CategoryLinkProps) => {
  const theme = useTheme();
  return (
    <CustomLink
      href={props.href}
      variant="grey"
      sx={{
        color: props.isTitle
          ? theme.customPalette.secondaryText
          : theme.customPalette.disabled,
        textTransform: props.isTitle ? "uppercase" : undefined,
        fontWeight: props.isTitle
          ? theme.fontWeight.semiBold
          : theme.fontWeight.medium,
      }}
    >
      {props.children}
    </CustomLink>
  );
};

export default FooterLink;
