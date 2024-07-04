import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useCartContext } from "~/contexts/CartContext";
import { formatCurrency } from "~/utils";

export const CartSummarySubtotal = () => {
  const theme = useTheme();
  const { selectedCartItems } = useCartContext();

  return (
    <MUI.Stack
      direction={"column"}
      justifyContent={"space-between"}
      gap={"0.5rem"}
    >
      <CustomTypography
        sx={{
          fontSize: theme.customTypography.fontSizes.header4,
          color: theme.customPalette.secondaryText,
          marginBottom: "0.5rem",
        }}
      >
        Subtotal
      </CustomTypography>
      {selectedCartItems.length > 0 ? (
        selectedCartItems.map((item) => {
          console.log(item.product_variant.price, item.quantity);
          return (
            <MUI.Stack
              key={item.id}
              direction={"row"}
              justifyContent={"space-between"}
              sx={{
                gap: "8px",
                padding: "4px",
                "&:hover": {
                  backgroundColor: theme.customPalette.main10,
                },
              }}
            >
              <CustomTypography
                sx={{ color: theme.customPalette.secondaryText }}
              >
                {item.product.name} - {item.product_variant.description}
                <CustomTypography
                  as="span"
                  fontSize={"header5"}
                  sx={{ fontWeight: "bold", marginLeft: "0.5rem" }}
                >
                  x{item.quantity}
                </CustomTypography>
              </CustomTypography>
              <CustomTypography sx={{ color: theme.customPalette.main }}>
                {formatCurrency(item.product_variant.price * item.quantity)}
              </CustomTypography>
            </MUI.Stack>
          );
        })
      ) : (
        <CustomTypography sx={{ color: theme.customPalette.disabled }}>
          Select a cart item to checkout
        </CustomTypography>
      )}
    </MUI.Stack>
  );
};
