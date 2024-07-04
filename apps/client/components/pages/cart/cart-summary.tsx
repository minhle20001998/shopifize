import {
  CustomButton,
  CustomLink,
  CustomTypography,
  MUI,
  useTheme,
} from "@shopifize/ui";
import { ContentTitle, ContentWrapper } from "~/components/ui";
import { CartSummaryPromo } from "./cart-summary-promo";
import { CartSummaryTotal } from "./cart-summary-total";
import { CartSummarySubtotal } from "./cart-summary-subtotal";
import { useCartContext } from "~/contexts/CartContext";

export const CartSummary = () => {
  const theme = useTheme();
  const { calculateTotal } = useCartContext();

  return (
    <ContentWrapper>
      <ContentTitle isLeftSide>
        <CustomTypography
          sx={{
            fontSize: theme.customTypography.fontSizes.header4,
          }}
        >
          Summary
        </CustomTypography>
      </ContentTitle>
      <MUI.Stack gap={"1.2rem"}>
        <Divider />
        <CartSummaryPromo />
        <Divider />
        <CartSummarySubtotal />
        <Divider />
        <CartSummaryTotal />
        <Divider />
        <CustomButton
          disabled={calculateTotal === 0}
          sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
        >
          Checkout
        </CustomButton>
        <CustomLink href={"#"}>Having a trouble ? Contact Admin</CustomLink>
        <Divider />
      </MUI.Stack>
    </ContentWrapper>
  );
};

const Divider = () => {
  const theme = useTheme();

  return (
    <MUI.Divider
      sx={{
        borderBottomWidth: "2px",
        borderBottomColor: theme.customPalette.grey40,
      }}
    />
  );
};
