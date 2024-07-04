import { Address, isNil } from "@shopifize/helpers";
import { ScreenSize } from "const/screen-size";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useInvalidateAddressQuery,
  useProfileQuery,
} from "queries";
import useMobileScreen from "~/hooks/useMobileScreen";
import { useAddressContext } from "./addrress-context";
import { useOpenState } from "~/hooks/useOpenState";
import {
  CustomButton,
  CustomChip,
  CustomModal,
  CustomTypography,
  MUI,
} from "@shopifize/ui";
import { useSnackbar } from "notistack";

const AddressesList = () => {
  const { data: addresses } = useGetAddressesQuery();

  const isHavingAddress = !isNil(addresses?.data) && addresses!.data.length > 0;

  return (
    <>
      {isHavingAddress ? <MUI.Divider sx={{ marginTop: "1rem" }} /> : <></>}
      <MUI.Stack gap={"16px"} marginTop={"16px"}>
        {isHavingAddress ? (
          addresses?.data.map((address) => {
            return <AddressListItem key={address.id} address={address} />;
          })
        ) : (
          <CustomTypography
            sx={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            You have no address registered
          </CustomTypography>
        )}
      </MUI.Stack>
    </>
  );
};

interface AddressListItemProps {
  address: Address;
}

export const AddressListItem = (props: AddressListItemProps) => {
  const { address } = props;
  const { isOpen, open: openDeleteDialog, close } = useOpenState();
  const isMobile = useMobileScreen(ScreenSize.sm);
  const {
    profile,
    updateProfile,
    invalidate: invalidateProfile,
  } = useProfileQuery();
  const defaultAddress = profile?.defaultAddress;
  const isDefault = defaultAddress === props.address.id;
  const deleteAddress = useDeleteAddressMutation();
  const { invalidateAddressQuery } = useInvalidateAddressQuery();
  const { open: openAddressModal } = useAddressContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    address.id &&
      deleteAddress.mutate(
        { id: address.id },
        {
          onSuccess: async () => {
            await invalidateAddressQuery();
            enqueueSnackbar("Address removed successfully", {
              variant: "success",
            });
            close();
          },
        }
      );
  };

  const handleEdit = () => {
    openAddressModal(address.id);
  };

  const handleSetDefault = () => {
    updateProfile.mutate({
      defaultAddress: address.id,
    });
    invalidateProfile();
  };

  return (
    <>
      <MUI.Stack
        sx={{
          padding: "16px 16px",
          transition: "background-color 0.25s ease-in-out",
          borderLeft: (theme) => `2px solid ${theme.customPalette.main}`,
          "&:hover": {
            backgroundColor: (theme) => theme.customPalette.main10,
          },
        }}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <MUI.Stack direction={"column"} gap={"0.5rem"}>
          <CustomTypography>{address.address}</CustomTypography>
          <CustomTypography
            sx={{ color: (theme) => theme.customPalette.secondaryText }}
          >
            {address.fullName} | {address.phoneNumber}
          </CustomTypography>
          {isDefault ? (
            <CustomChip
              label={"Default"}
              sx={{
                width: "4.5rem",
              }}
              variant="outlined"
              color="primary"
            />
          ) : (
            <></>
          )}
        </MUI.Stack>
        <MUI.Stack
          direction={isMobile ? "column" : "row"}
          sx={{ minWidth: "35%", height: "fit-content" }}
        >
          <MUI.Grid container justifyContent={"flex-end"}>
            <MUI.Grid item>
              {isDefault ? null : (
                <CustomButton variant="text" onClick={handleSetDefault}>
                  Set default
                </CustomButton>
              )}
            </MUI.Grid>
            <MUI.Grid item>
              <CustomButton variant="text" onClick={handleEdit}>
                Edit
              </CustomButton>
            </MUI.Grid>
            <MUI.Grid item>
              <CustomButton
                variant="text"
                color="error"
                onClick={() => openDeleteDialog()}
              >
                Delete
              </CustomButton>
            </MUI.Grid>
          </MUI.Grid>
        </MUI.Stack>
      </MUI.Stack>
      <CustomModal
        title="Delete Address"
        open={isOpen}
        onClose={close}
        actionsProps={{
          applyButtonProps: {
            content: "Delete",
            color: "error",
            type: "button",
            onClick: handleDelete,
          },
          cancelButtonProps: {
            variant: "text",
            onClick: close,
          },
        }}
      >
        Are you sure to delete this address ?
      </CustomModal>
    </>
  );
};

export default AddressesList;
