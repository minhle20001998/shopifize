import * as Yup from "yup";
import "yup-phone-lite";
import { useFormik } from "formik";
import { DetailedHTMLProps, FormHTMLAttributes } from "react";
import { useAddressContext } from "./addrress-context";
import { InnerNullable, isNil } from "@shopifize/helpers";
import { CustomInput, CustomMap, CustomPhoneInput } from "@shopifize/ui";
import { useSnackbar } from "notistack";
import {
  useAddAddressMutation,
  useGetAddressQuery,
  useInvalidateAddressQuery,
  useUpdateAddressMutation,
} from "~/queries";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string()
    .phone("VN", "Please enter a valid phone number")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  lngLat: Yup.object().shape({
    longitude: Yup.number().required("Longtitude is required"),
    latitude: Yup.number().required("Latitude is required"),
  }),
});

export type AddressValueType = Yup.InferType<typeof validationSchema>;

export type Props = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  mapAccessToken: string;
};

export const AddressForm = (props: Props) => {
  const { mapAccessToken, ...formProps } = props;
  const { close, itemId } = useAddressContext();
  const { invalidateAddressQuery } = useInvalidateAddressQuery();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !isNil(itemId);

  const onSuccess = async () => {
    await invalidateAddressQuery();
    enqueueSnackbar("Address updated succcessfully", {
      variant: "success",
    });
    close();
  };

  const { data: address } = useGetAddressQuery(itemId!, { enabled: !!itemId });

  const addAddress = useAddAddressMutation();

  const updateAddress = useUpdateAddressMutation();

  const initialValues: InnerNullable<AddressValueType> = {
    fullName: address?.data?.fullName ?? "",
    phoneNumber: address?.data?.phoneNumber ?? "",
    address: address?.data?.address ?? "",
    lngLat:
      address?.data.longitude && address?.data.latitude
        ? {
            longitude: address.data.longitude,
            latitude: address.data.latitude,
          }
        : null,
  };

  const handleSubmit = (values: AddressValueType) => {
    if (!isEdit) {
      addAddress.mutate(
        {
          ...values,
          longitude: values.lngLat?.longitude,
          latitude: values.lngLat?.latitude,
        },
        {
          onSuccess,
          onError: (e) => {
            enqueueSnackbar(`Failed to update address: ${e.message}`, {
              variant: "error",
            });
          },
        }
      );
    } else {
      itemId
        ? updateAddress.mutate(
            {
              id: itemId,
              ...values,
              longitude: values.lngLat.longitude,
              latitude: values.lngLat.latitude,
            },
            {
              onSuccess,
              onError: (e) => {
                enqueueSnackbar(`Failed to add address: ${e.message}`, {
                  variant: "error",
                });
              },
            }
          )
        : enqueueSnackbar(`There is an error, please try again`, {
            variant: "error",
          });
    }
  };

  const formik = useFormik({
    initialValues: initialValues as AddressValueType,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit} {...formProps}>
      <CustomInput
        placeholder="Enter full name"
        label="Fullname"
        name="fullName"
        formik={formik}
      />
      <CustomPhoneInput
        label="Phone number"
        name="phoneNumber"
        formik={formik}
      />
      {/* <CustomAddress label="Address" name="address" formik={formik} /> */}
      <CustomInput label="Address" name="address" formik={formik} />
      <CustomMap
        accessToken={mapAccessToken}
        name={"lngLat"}
        formik={formik}
        helperText={`Please pick your exact location on the map.
         This will help our shipper to locate your address`}
      />
      <CustomInput
        disabled
        label="Longitude & Latitude"
        value={
          formik.values.lngLat?.longitude && formik.values.lngLat?.latitude
            ? `${formik.values.lngLat?.longitude}, ${formik.values.lngLat?.latitude}`
            : ""
        }
      />
    </form>
  );
};
