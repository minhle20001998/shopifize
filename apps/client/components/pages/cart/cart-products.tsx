import { CartItem } from "@shopifize/helpers";
import {
  Column,
  CustomTable,
  CustomTypography,
  MUI,
  useTheme,
} from "@shopifize/ui";
import Image from "next/image";
import { ContentTitle, ContentWrapper } from "~/components/ui";
import { useCartContext } from "~/contexts/CartContext";
import { useGetCartItemsQuery } from "~/queries";
import { formatCurrency } from "~/utils";

export const CartProducts = () => {
  const theme = useTheme();
  const { setSelectedCartItems } = useCartContext();
  const { data } = useGetCartItemsQuery();

  const columns: Column<CartItem & Record<string, string>>[] = [
    {
      id: "product",
      name: "Product",
      style: {
        width: "40%",
      },
      type: {
        custom: (data) => {
          return (
            <>
              <MUI.Stack direction={"row"} gap={"1rem"}>
                <Image
                  alt={data?.product.description ?? ""}
                  src={data?.product_variant.imgSrc ?? ""}
                  width={"120"}
                  height={"240"}
                  style={{
                    width: "100%",
                    maxWidth: "120px",
                    maxHeight: "240px",
                    height: "100%",
                  }}
                />
                <MUI.Stack gap={"0.5rem"}>
                  <CustomTypography
                    style={{
                      fontSize: theme.customTypography.fontSizes.header5,
                    }}
                  >
                    {data?.product.name}
                  </CustomTypography>
                  <CustomTypography
                    style={{ color: theme.customPalette.secondaryText }}
                  >
                    {data?.product_variant.description}
                  </CustomTypography>
                </MUI.Stack>
              </MUI.Stack>
            </>
          );
        },
      },
    },
    {
      id: "quantity",
      name: "Quantity",
      type: {
        custom: (data) => {
          return <>{data?.quantity ?? 1}</>;
        },
      },
    },
    {
      id: "price",
      name: "Price",
      type: {
        custom: (data) => {
          return <>{formatCurrency(data?.product_variant.price ?? 0)}</>;
        },
      },
    },
    {
      id: "total_price",
      name: "Total Price",
      type: {
        custom: (data) => {
          return (
            <CustomTypography
              style={{
                fontSize: theme.customTypography.fontSizes.header5,
                color: theme.customPalette.main,
              }}
            >
              {formatCurrency(
                (data?.quantity ?? 1) * (data?.product_variant.price ?? 0)
              )}
            </CustomTypography>
          );
        },
      },
    },
    {
      id: "actions",
      name: "",
      type: {
        actions: [
          {
            name: "Remove",
            variant: "delete",
            style: "icon",
            callback: () => {},
          },
        ],
      },
    },
  ];

  return (
    <ContentWrapper>
      <ContentTitle isLeftSide>
        <CustomTypography
          sx={{
            fontSize: theme.customTypography.fontSizes.header4,
          }}
        >
          Products
        </CustomTypography>
      </ContentTitle>
      <CustomTable
        enableRowSelection
        onRowSelection={(data) => {
          setSelectedCartItems(data);
        }}
        data={
          (data?.data.cart_item as (CartItem & Record<string, string>)[]) || []
        }
        columns={columns}
      />
    </ContentWrapper>
  );
};
