import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useCartContext } from "~/contexts/CartContext";
import { formatCurrency } from "~/utils";

export const CartSummaryTotal = () => {
  const theme = useTheme();
  const { calculateTotal } = useCartContext();

  return (
    <MUI.Stack direction={"row"} justifyContent={"space-between"}>
      <CustomTypography
        sx={{
          fontSize: theme.customTypography.fontSizes.header4,
          color: theme.customPalette.secondaryText,
        }}
      >
        Estimated Total
      </CustomTypography>
      <CustomTypography
        sx={{
          fontSize: theme.customTypography.fontSizes.header4,
          color: theme.customPalette.main,
        }}
      >
        {formatCurrency(calculateTotal)}
      </CustomTypography>
    </MUI.Stack>
  );
};
