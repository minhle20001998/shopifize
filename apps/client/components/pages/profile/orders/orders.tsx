import {
  Order,
  OrderStatus,
  PaymentStatus,
  safeNumber,
} from "@shopifize/helpers";
import {
  Column,
  CustomCard,
  CustomChip,
  CustomChipProps,
  CustomLink,
  CustomTable,
  CustomTypography,
  MUI,
  useTheme,
} from "@shopifize/ui";
import { useGetOrders } from "~/queries/order";
import { formatCurrency } from "~/utils";

export const OrderContent = () => {
  const theme = useTheme();

  const { data } = useGetOrders();

  const columns: Column<Order & Record<string, unknown>>[] = [
    {
      id: "created_at",
      name: "Date",
      type: {
        date: { sx: { color: (theme) => theme.customPalette.secondaryText } },
      },
    },
    {
      id: "orders",
      name: "Orders",
      type: {
        custom: (data) => {
          return (
            <MUI.Stack gap={"1rem"}>
              {data?.items.map((item) => {
                return (
                  <CustomLink
                    hoverStyle="color"
                    key={item.id}
                    href={`/product/${item.product.id}`}
                  >
                    <MUI.Stack>
                      <CustomTypography sx={{ color: "inherit" }}>
                        {item?.product?.name}
                      </CustomTypography>
                      <CustomTypography
                        sx={{
                          color: (theme) => theme.customPalette.secondaryText,
                        }}
                        fontSize={"label1"}
                      >
                        {item?.product_variant?.description}
                      </CustomTypography>
                    </MUI.Stack>
                  </CustomLink>
                );
              })}
            </MUI.Stack>
          );
        },
      },
    },
    {
      id: "price",
      name: "Price",
      type: {
        custom: (data) => {
          return <>{formatCurrency(safeNumber(data?.total_price, 0))}</>;
        },
      },
    },
    {
      id: "payment",
      name: "Payment",
      type: {
        custom: (data) => {
          return (
            <>
              {data?.payment.map((pay) => {
                const color: Record<PaymentStatus, CustomChipProps["color"]> = {
                  [PaymentStatus.PENDING]: "default",
                  [PaymentStatus.COMPLETED]: "success",
                  [PaymentStatus.CANCELLED]: "warning",
                  [PaymentStatus.FAILED]: "error",
                  [PaymentStatus.REFUNDED]: "warning",
                };

                return (
                  <CustomChip
                    color={color[pay.status as unknown as PaymentStatus]}
                    key={pay.id}
                    label={`${formatCurrency(pay.amount)} - ${pay.status}`}
                  />
                );
              })}
            </>
          );
        },
      },
    },
    {
      id: "deliver",
      name: "Deliver",
      type: {
        custom: (data) => {
          const color: Record<string, CustomChipProps["color"]> = {
            [OrderStatus.PENDING]: "default",
            [OrderStatus.COMPLETED]: "success",
            [OrderStatus.FAILED]: "error",
            [OrderStatus.CANCELLED]: "warning",
            [OrderStatus.DELIVERED]: "success",
            [OrderStatus.PROCESSING]: "info",
            [OrderStatus.REFUNDED]: "warning",
            [OrderStatus.SHIPPED]: "success",
          };

          return (
            <>
              <CustomChip
                color={color[data?.status ?? OrderStatus.PENDING]}
                label={data?.status}
              />
            </>
          );
        },
      },
    },
    {
      id: "actions",
      name: "Actions",
      type: {
        actions: [
          {
            name: "Track",
            variant: "add",
            isDisable: () => {
              return false;
            },
          },
          {
            name: "Cancel",
            variant: "delete",
            isDisable: () => {
              return false;
            },
          },
        ],
      },
    },
  ];

  return (
    <CustomCard>
      <MUI.Stack direction={"column"} sx={{ height: "100%" }}>
        <CustomTypography
          sx={{
            fontSize: theme.customTypography.fontSizes.header5,
            fontWeight: theme.fontWeight.semiBold,
          }}
        >
          My Orders
        </CustomTypography>
        <CustomTypography
          sx={{ fontSize: theme.customTypography.fontSizes.body2 }}
        >
          Manage your orders
        </CustomTypography>
      </MUI.Stack>
      <MUI.Box sx={{ marginTop: "1rem" }}>
        <CustomTable
          data={(data?.data as (Order & Record<string, unknown>)[]) || []}
          columns={columns}
        />
      </MUI.Box>
    </CustomCard>
  );
};
