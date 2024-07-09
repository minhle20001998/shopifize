import {
  CustomButton,
  CustomLink,
  CustomModal,
  CustomTypography,
  MUI,
  useOpenState,
  useTheme,
} from "@shopifize/ui";
import { ContentTitle, ContentWrapper } from "~/components/ui";
import { CartSummaryPromo } from "./cart-summary-promo";
import { CartSummaryTotal } from "./cart-summary-total";
import { CartSummarySubtotal } from "./cart-summary-subtotal";
import { useCartContext } from "~/contexts/CartContext";
import { useCreateOrder } from "~/queries/order";
import { ReactSVG } from "react-svg";
import { useSnackbar } from "notistack";
import { useInvalidateCartItems } from "~/queries";

export const CartSummary = () => {
  const theme = useTheme();
  const { calculateTotal, selectedCartItems, setSelectedCartItems } =
    useCartContext();
  const { isOpen, open, close } = useOpenState();
  const { mutate } = useCreateOrder();
  const { enqueueSnackbar } = useSnackbar();
  const { invalidateCartItems } = useInvalidateCartItems();

  const handleCheckout = () => {
    const ids = selectedCartItems.map((item) => item.id);
    mutate(ids, {
      onSuccess: async () => {
        enqueueSnackbar("Transaction is completed", { variant: "success" });
        await invalidateCartItems();
        setSelectedCartItems([]);
        close();
      },
      onError: () => {
        enqueueSnackbar("Transaction fail to proceed", { variant: "error" });
      },
    });
  };

  return (
    <>
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
            onClick={open}
            disabled={calculateTotal === 0}
            sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            Checkout
          </CustomButton>
          <CustomLink href={"#"}>Having a trouble ? Contact Admin</CustomLink>
          <CustomLink href={"profile/orders"} variant="grey">
            View your orders
          </CustomLink>
          <Divider />
        </MUI.Stack>
      </ContentWrapper>
      <CustomModal
        size="sm"
        open={isOpen}
        actionsProps={{
          applyButtonProps: {
            content: "Confirm",
            type: "button",
            onClick: handleCheckout,
          },
          cancelButtonProps: {
            variant: "text",
            sx: { color: (theme) => theme.customPalette.grey100 },
            onClick: close,
          },
        }}
      >
        <MUI.Stack
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            width: "100%",
            "& svg": {
              maxWidth: "300px",
              width: "100%",
              height: "300px",
            },
          }}
        >
          <ReactSVG src={"/payment.svg"} />
          <CustomTypography fontSize={"header4"}>
            Please confirm your transaction
          </CustomTypography>
        </MUI.Stack>
      </CustomModal>
    </>
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
