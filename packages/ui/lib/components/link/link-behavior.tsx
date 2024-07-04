import React from "react";
import NextLink, { LinkProps } from "next/link";
export const LinkBehaviour = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <NextLink ref={ref} {...props} />;
  }
);

LinkBehaviour.displayName = "LinkBehavior";
