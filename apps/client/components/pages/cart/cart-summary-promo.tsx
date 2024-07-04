import { CustomButton, CustomInput, MUI } from "@shopifize/ui";
import { useCartContext } from "~/contexts/CartContext";

export const CartSummaryPromo = () => {
  const { calculateTotal } = useCartContext();

  return (
    <MUI.Stack>
      <MUI.Stack direction="row" gap={"0.5rem"} alignItems={"flex-end"}>
        <CustomInput label="Do you have promo code ?" helperTextHidden />
        <CustomButton
          disabled={calculateTotal === 0}
          fullWidth={false}
          sx={{ height: "40px" }}
        >
          Apply
        </CustomButton>
      </MUI.Stack>
    </MUI.Stack>
  );
};
