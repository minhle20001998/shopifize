"use-client";

import React from "react";
import { CustomIconButton, MUI, MUIIcon, useTheme } from "@shopifize/ui";
import { useGetCartItemsQuery } from "~/queries";
import Link from "next/link";

export const Cart = () => {
  const theme = useTheme();
  const { data, isError } = useGetCartItemsQuery();
  const itemCount = isError ? 0 : data?.data.cart_item.length ?? 0;
  return (
    <Link href="/cart">
      <CustomIconButton
        sx={{
          "&:hover .shopping-cart-icon": {
            color: theme.customPalette.main,
          },
        }}
      >
        <MUI.Badge badgeContent={itemCount} color={"primary"}>
          <MUIIcon.ShoppingCart className="shopping-cart-icon" />
        </MUI.Badge>
      </CustomIconButton>
    </Link>
  );
};
