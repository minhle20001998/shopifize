import { CartItem } from "@shopifize/helpers";
import {
  Column,
  CustomTable,
  CustomTypography,
  DeleteConfirmationModal,
  MUI,
  useOpenState,
  useTheme,
} from "@shopifize/ui";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ContentTitle, ContentWrapper } from "~/components/ui";
import { useCartContext } from "~/contexts/CartContext";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
  useRemoveItemsFromCartMutation,
} from "~/queries";
import { formatCurrency } from "~/utils";

export const CartProducts = () => {
  const theme = useTheme();
  const { selectedCartItems, setSelectedCartItems } = useCartContext();
  const { data, refetch } = useGetCartItemsQuery();
  const { mutate: removeItem } = useRemoveFromCartMutation();
  const { mutate: removeItems } = useRemoveItemsFromCartMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isOpen, open, close } = useOpenState();
  const { enqueueSnackbar } = useSnackbar();

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
            callback: (data) => {
              setDeleteId(data.id);
              open();
            },
          },
        ],
      },
    },
  ];

  return (
    <>
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
            (data?.data.cart_item as (CartItem & Record<string, string>)[]) ||
            []
          }
          columns={columns}
        />
      </ContentWrapper>
      <DeleteConfirmationModal
        handleClose={close}
        open={isOpen}
        title="Remove these items from cart ?"
        handleDelete={() => {
          if (
            selectedCartItems.length > 0 &&
            selectedCartItems.some((value) => value.id === deleteId)
          ) {
            removeItems(
              selectedCartItems.map((item) => item.id),
              {
                onSuccess: async () => {
                  await refetch();
                  enqueueSnackbar("Remove items successfully", {
                    variant: "success",
                  });
                  close();
                },
                onError: () => {
                  enqueueSnackbar("Fail to remove items", {
                    variant: "error",
                  });
                },
              }
            );

            return;
          }
          if (deleteId) {
            removeItem(deleteId, {
              onSuccess: async () => {
                await refetch();
                enqueueSnackbar("Remove item successfully", {
                  variant: "success",
                });
                close();
              },
              onError: () => {
                enqueueSnackbar("Fail to remove item", {
                  variant: "error",
                });
              },
            });
          }
        }}
      />
    </>
  );
};
