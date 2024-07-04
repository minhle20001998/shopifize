/* eslint-disable react-hooks/exhaustive-deps */
import { removeEmptyValues } from "@shopifize/helpers";
import {
  CustomButton,
  CustomCheckbox,
  CustomTypography,
  MUI,
  MUIIcon,
  NumberInput,
  useTheme,
} from "@shopifize/ui";
import { useFormik } from "formik";
import Router, { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { ChangeEvent, useMemo } from "react";
import * as Yup from "yup";
import {
  ProductSidebarFilterRating,
  removeSlugFromQuery,
} from "./product-sidebar-filter-rating";

const validationSchema = Yup.object().shape({
  startPrice: Yup.number().positive(),
  endPrice: Yup.number().positive().moreThan(Yup.ref("startPrice")),
});

export type PriceFormType = Yup.InferType<typeof validationSchema>;

export const ProductSidebarFilter = () => {
  const theme = useTheme();
  const route = useRouter();
  const startPrice = route.query.startPrice;
  const endPrice = route.query.endPrice;

  const priceInitialValues: PriceFormType = useMemo(() => {
    return {
      startPrice: Number(startPrice?.toString()) ?? 0,
      endPrice: Number(endPrice?.toString()) ?? 0,
    };
  }, [startPrice?.toString(), endPrice?.toString()]);

  const handlePriceSubmit = async (values: PriceFormType) => {
    await Router.replace({
      pathname: location.pathname,
      query: removeEmptyValues({
        ...removeSlugFromQuery(route.query),
        ...values,
      }) as ParsedUrlQueryInput,
    });
  };

  const handleOnSaleClick = async (e: ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      await Router.replace({
        pathname: location.pathname,
        query: removeEmptyValues({
          ...removeSlugFromQuery(route.query),
          onSale: true,
        }) as ParsedUrlQueryInput,
      });
    } else {
      const removedOnSaleQueries = route.query;
      delete removedOnSaleQueries.onSale;
      await Router.replace({
        pathname: location.pathname,
        query: removeEmptyValues(
          removeSlugFromQuery(removedOnSaleQueries)
        ) as ParsedUrlQueryInput,
      });
    }
  };

  const priceFormik = useFormik({
    initialValues: priceInitialValues,
    enableReinitialize: true,
    onSubmit: handlePriceSubmit,
    validationSchema,
  });

  return (
    <>
      <MUI.Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
        <MUIIcon.FilterAltOutlined />
        <CustomTypography
          sx={{
            fontWeight: theme.fontWeight.semiBold,
            fontSize: theme.customTypography.fontSizes.header5,
          }}
        >
          Filter
        </CustomTypography>
      </MUI.Stack>
      {/* --------------Brands--------------- */}
      {/* <MUI.Stack>
        <CustomTypography
          sx={{
            fontWeight: theme.fontWeight.semiBold,
            fontSize: theme.customTypography.fontSizes.body2,
          }}
        >
          Brands
        </CustomTypography>
        <CustomCheckbox label="Brand 1" />
        <CustomCheckbox label="Brand 2" />
        <CustomCheckbox label="Brand 3" />
        <CustomCheckbox label="Brand 4" />
      </MUI.Stack> */}
      {/* --------------Price Range--------------- */}

      <form onSubmit={priceFormik.handleSubmit}>
        <MUI.Stack gap={"0.75rem"}>
          <CustomTypography
            sx={{
              fontWeight: theme.fontWeight.semiBold,
              fontSize: theme.customTypography.fontSizes.body2,
            }}
          >
            Price Range
          </CustomTypography>
          <MUI.Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
            <NumberInput
              name="startPrice"
              formik={priceFormik}
              showHelperButton={false}
              placeholder="Min"
              helperTextHidden
            />
            <span>-</span>
            <NumberInput
              name="endPrice"
              formik={priceFormik}
              showHelperButton={false}
              placeholder="Max"
              helperTextHidden
            />
          </MUI.Stack>
          <CustomButton type="submit">Apply</CustomButton>
        </MUI.Stack>
      </form>
      {/* --------------Rating--------------- */}
      <CustomTypography
        sx={{
          fontWeight: theme.fontWeight.semiBold,
          fontSize: theme.customTypography.fontSizes.body2,
        }}
      >
        Rating
      </CustomTypography>
      <MUI.Stack gap={"0.5rem"}>
        <ProductSidebarFilterRating />
      </MUI.Stack>
      {/* --------------Promotion--------------- */}
      <MUI.Stack>
        <CustomTypography
          sx={{
            fontWeight: theme.fontWeight.semiBold,
            fontSize: theme.customTypography.fontSizes.body2,
          }}
        >
          Promotion
        </CustomTypography>
        <CustomCheckbox label="On Sale" onChange={handleOnSaleClick} />
      </MUI.Stack>
    </>
  );
};
