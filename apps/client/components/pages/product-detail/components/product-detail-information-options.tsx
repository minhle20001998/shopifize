import {
  CustomButton,
  CustomRadio,
  CustomSelect,
  CustomTypography,
  MUI,
  MUIIcon,
  NumberInput,
} from "@shopifize/ui";
import { useRouter } from "next/router";
import {
  useAddToCartMutation,
  useGetAddressesQuery,
  useInvalidateCartItems,
  useProfileQuery,
} from "~/queries";
import { CurrentProductVariantType } from "./product-detail-information";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDeepCompareEffect } from "use-deep-compare";
import { isNil, safeNumber } from "@shopifize/helpers";
import { CartItemType } from "~/utils";
import { useSnackbar } from "notistack";

interface ProductDetailInformationOptionsProps {
  index: number;
  currentProduct?: CurrentProductVariantType;
  changeVariant: (index: number) => Promise<void>;
}

const validationSchema = Yup.object().shape({
  variant: Yup.string().required("Variant Is Required"),
  shippingTo: Yup.string().required("Shipping Destinatin Is Required"),
  shippingType: Yup.string().required("Shipping Type Is Required"),
});

export const ProductDetailInformationOptions = ({
  index,
  changeVariant,
  currentProduct,
}: ProductDetailInformationOptionsProps) => {
  const router = useRouter();
  const query = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetAddressesQuery();
  const { mutate: addToCart } = useAddToCartMutation();
  const { invalidateCartItems } = useInvalidateCartItems();
  const addresses = data?.data;
  const { profile } = useProfileQuery();
  const defaultAddress = profile?.defaultAddress;

  const formik = useFormik({
    initialValues: {
      variant: currentProduct?.variants?.[safeNumber(query.variant, 0)]?.id,
      shippingTo: defaultAddress ?? "",
      shippingType: "",
      quantity: 1,
    },
    onSubmit: (values) => {
      if (query.id && !isNil(values.variant)) {
        handleAddToCart({
          productId: query.id.toString(),
          productVariantId: values.variant!,
          quantity: values.quantity,
        });
      }
    },
    validationSchema,
    enableReinitialize: true,
  });

  const handleAddToCart = (values: CartItemType) => {
    addToCart(values, {
      onSuccess: async () => {
        enqueueSnackbar("Product added to cart", { variant: "success" });
        await invalidateCartItems();
      },
      onError: () => {
        enqueueSnackbar("Fail to add to cart", { variant: "success" });
      },
    });
  };

  useDeepCompareEffect(() => {
    if (!isNil(query.variant) && !isNaN(Number(query.variant))) {
      void formik.setFieldValue(
        "variant",
        currentProduct?.variants?.[Number(query.variant?.toString())]?.id
      );
    }
  }, [query.variant, currentProduct]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <MUI.Grid container sx={{ marginTop: "1rem" }}>
          <MUI.Grid item display={"flex"} alignItems={"center"} sm={2}>
            <CustomTypography
              sx={{ color: (theme) => theme.customPalette.grey80 }}
            >
              Variants
            </CustomTypography>
          </MUI.Grid>
          <MUI.Grid
            item
            direction={"row"}
            sm={10}
            display={"flex"}
            gap={"0.5rem"}
          >
            {currentProduct?.variants?.map((variant) => {
              const isActive = index === variant.index;
              return (
                <CustomButton
                  key={variant.name}
                  variant={isActive ? "outlined" : "text"}
                  fullWidth={false}
                  sx={
                    isActive
                      ? undefined
                      : {
                          color: (theme) => theme.customPalette.secondaryText,
                          border: (theme) =>
                            `1px solid ${theme.customPalette.grey50}`,
                        }
                  }
                  onClick={() => {
                    changeVariant(variant.index)
                      .then(() => {})
                      .catch(() => {});
                    formik
                      .setFieldValue("variant", variant.id)
                      .then(() => {})
                      .catch(() => {});
                  }}
                >
                  {variant.name}
                </CustomButton>
              );
            })}
          </MUI.Grid>
        </MUI.Grid>
        <MUI.Grid container sx={{ marginTop: "1rem" }}>
          <MUI.Grid item sm={2}>
            <CustomTypography
              sx={{
                color: (theme) => theme.customPalette.grey80,
                marginTop: "0.5rem",
              }}
            >
              Shipping
            </CustomTypography>
          </MUI.Grid>
          <MUI.Grid
            item
            direction={"row"}
            sm={10}
            display={"flex"}
            gap={"0.5rem"}
          >
            <MUI.Stack sx={{ width: "100%" }} gap={"1rem"}>
              <MUI.Stack direction={"row"} gap={"0.8rem"} alignItems={"center"}>
                <CustomTypography>Shipping from</CustomTypography>
                <CustomTypography as={"i"}>Overseas</CustomTypography>
                <CustomTypography>To</CustomTypography>
                {addresses ? (
                  <CustomSelect
                    value={formik.values.shippingTo || defaultAddress}
                    placeholderOption={{ id: 0, label: "Choose address" }}
                    options={addresses.map((value) => {
                      return {
                        id: value.id,
                        label: value.address,
                      };
                    })}
                    helperTextHidden
                    sx={{ maxWidth: "160px" }}
                    onChange={(e) => {
                      formik
                        .setFieldValue("shippingTo", e.target.value)
                        .then(() => {})
                        .catch(() => {});
                    }}
                  />
                ) : (
                  <CustomButton
                    fullWidth={false}
                    variant="text"
                    href={`/login?redirect=${router.pathname}`}
                  >
                    Login to select location
                  </CustomButton>
                )}
              </MUI.Stack>
              <CustomRadio
                helperTextHidden
                direction="column"
                label="Shipping Options"
                options={[
                  {
                    label: (
                      <>
                        <CustomTypography
                          as={"span"}
                          sx={{
                            color: (theme) =>
                              theme.customPalette.severeWarningStatus,
                            fontWeight: (theme) => theme.fontWeight.semiBold,
                            fontStyle: "italic",
                          }}
                        >
                          Flash
                        </CustomTypography>
                        <CustomTypography
                          as={"span"}
                          sx={{
                            marginLeft: "0.5rem",
                            fontWeight: "bold",
                            color: (theme) => theme.customPalette.secondaryText,
                          }}
                        >
                          25.000 đ
                        </CustomTypography>{" "}
                        <CustomTypography
                          as={"span"}
                          sx={{
                            color: (theme) => theme.customPalette.secondaryText,
                          }}
                        >
                          (within 2 hour)
                        </CustomTypography>
                      </>
                    ),
                    value: 1,
                  },
                  {
                    label: (
                      <>
                        <CustomTypography
                          as={"span"}
                          sx={{
                            color: (theme) => theme.customPalette.infoStatus,
                            fontWeight: (theme) => theme.fontWeight.semiBold,
                            fontStyle: "italic",
                          }}
                        >
                          Saving
                        </CustomTypography>
                        <CustomTypography
                          as={"span"}
                          sx={{
                            marginLeft: "0.5rem",
                            fontWeight: "bold",
                            color: (theme) => theme.customPalette.secondaryText,
                          }}
                        >
                          Free
                        </CustomTypography>{" "}
                        <CustomTypography
                          as={"span"}
                          sx={{
                            color: (theme) => theme.customPalette.secondaryText,
                          }}
                        >
                          (within 1 week)
                        </CustomTypography>
                      </>
                    ),
                    value: 2,
                  },
                ]}
                onChange={(_, value) => {
                  formik
                    .setFieldValue("shippingType", value)
                    .then(() => {})
                    .catch(() => {});
                }}
              />
            </MUI.Stack>
          </MUI.Grid>
        </MUI.Grid>
        <MUI.Grid container sx={{ marginTop: "1rem" }}>
          <MUI.Grid item sm={2} display={"flex"} alignItems={"center"}>
            <CustomTypography
              sx={{ color: (theme) => theme.customPalette.grey80 }}
            >
              Quantity
            </CustomTypography>
          </MUI.Grid>
          <MUI.Grid
            item
            direction={"row"}
            sm={10}
            display={"flex"}
            gap={"1rem"}
            alignItems={"center"}
          >
            <NumberInput
              value={1}
              sx={{ maxWidth: "80px" }}
              showHelperButton={false}
              helperTextHidden
              onValueChange={(value) => {
                formik
                  .setFieldValue("quantity", value)
                  .then(() => {})
                  .catch(() => {});
              }}
            />
            <CustomTypography>
              {currentProduct?.quantity} pieces available
            </CustomTypography>
          </MUI.Grid>
        </MUI.Grid>
        <MUI.Stack direction={"row"} gap={"1rem"} marginTop={"1rem"}>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            startIcon={<MUIIcon.AddShoppingCart />}
            sx={{ padding: "0.5rem 2rem" }}
            type="submit"
          >
            Add to cart
          </CustomButton>
          <CustomButton fullWidth={false} sx={{ padding: "0.5rem 2.5rem" }}>
            Buy Now
          </CustomButton>
        </MUI.Stack>
      </form>
    </>
  );
};
