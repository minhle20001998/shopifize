import {
  CustomButton,
  CustomCard,
  CustomModal,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";
import AddressesList from "./addresses-list";
import { useId } from "react";
import { AddressContext } from "./addrress-context";
import { AddressForm } from "./address-form";
import { useOpenState } from "~/hooks/useOpenState";
import { isNil } from "@shopifize/helpers";

export const AddressesContent = (props: { mapAccessToken: string }) => {
  const { mapAccessToken } = props;
  const theme = useTheme();
  const { itemId, isOpen, open, close } = useOpenState();
  const formId = useId();
  const isEdit = !isNil(itemId);

  return (
    <AddressContext.Provider value={{ itemId, isOpen, open, close }}>
      <CustomCard>
        <MUI.Stack direction={"column"} sx={{ height: "100%" }}>
          <CustomTypography
            fontSize={"header5"}
            sx={{
              fontWeight: theme.fontWeight.semiBold,
            }}
          >
            My Addresses
          </CustomTypography>
          <CustomTypography fontSize={"body2"}>
            Manage your account addresses
          </CustomTypography>
        </MUI.Stack>
        <MUI.Grid container sx={{ marginTop: "1rem" }}>
          <MUI.Grid item xs={6} sm={3} md={2}>
            <CustomButton
              fullWidth={false}
              onClick={() => open()}
              startIcon={<MUIIcon.Add />}
            >
              Address
            </CustomButton>
          </MUI.Grid>
        </MUI.Grid>
        <AddressesList />
      </CustomCard>
      <CustomModal
        title="Add Address"
        open={isOpen}
        onClose={close}
        actionsProps={{
          applyButtonProps: {
            content: isEdit ? "Update" : "Add",
            type: "submit",
            form: formId,
          },
          cancelButtonProps: {
            onClick: close,
          },
        }}
      >
        <AddressForm mapAccessToken={mapAccessToken} id={formId} />
      </CustomModal>
    </AddressContext.Provider>
  );
};
