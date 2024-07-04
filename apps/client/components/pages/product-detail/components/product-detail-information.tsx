import { isNil } from "@shopifize/helpers";
import { CustomTypography, MUI, MUIIcon } from "@shopifize/ui";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ContentWrapper } from "~/components/ui";
import ImageMagnifier from "~/components/ui/image-magnifier";
import { useGetProductQuery } from "~/queries/products";
import { formatCurrency } from "~/utils";
import { ProductDetailInformationOptions } from "./product-detail-information-options";

interface Props {
  id?: string;
}

export type CurrentProductVariantType = {
  productName: string | undefined;
  price: number | undefined;
  rating: number | undefined;
  sold: number | undefined;
  stars: string | undefined;
  imgUrl: string | undefined;
  quantity: number | undefined;
  variants:
    | {
        name: string;
        index: number;
        id: string;
      }[]
    | undefined;
};

export const ProductDetailInformation = ({ id }: Props) => {
  const router = useRouter();
  const query = router.query;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isNil(query.variant) && !isNaN(Number(query.variant))) {
      setIndex(Number(query.variant?.toString()));
    }
  }, [query.variant]);

  const changeVariant = async (index: number) => {
    await router.replace({
      pathname: location.pathname,
      query: {
        variant: index,
      },
    });
  };

  const { data } = useGetProductQuery(id!, {
    enabled: !!id,
  });

  const product = data?.data;

  const currentProductVariant = useMemo<CurrentProductVariantType>(() => {
    const productVariant = product?.productVariants?.[index];

    return {
      productName: product?.name,
      price: productVariant?.price,
      rating: productVariant?.productStatus.rating,
      sold: productVariant?.productStatus.sold,
      stars: productVariant?.productStatus.stars,
      imgUrl: productVariant?.imgSrc,
      quantity: productVariant?.productStatus.quantity,
      variants: product?.productVariants.map((variant, index) => {
        return {
          name: variant.description,
          index: index,
          id: variant.id,
        };
      }),
    };
  }, [index, product]);

  return (
    <>
      <ContentWrapper sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <MUI.Grid container spacing={"2rem"}>
          <MUI.Grid item sm={5}>
            <ImageMagnifier
              key={currentProductVariant?.imgUrl ?? ""}
              imgUrl={currentProductVariant?.imgUrl ?? ""}
            />
            <MUI.Stack
              direction={"row"}
              justifyContent={"center"}
              marginTop={"1rem"}
              gap={"0.5rem"}
            >
              <MUIIcon.Link
                sx={{
                  color: (theme) => theme.customPalette.secondaryText,
                  fontSize: "28px",
                }}
              />
              <MUIIcon.Facebook sx={{ color: "#3b5998", fontSize: "28px" }} />
              <MUIIcon.Twitter sx={{ color: "#1da1f2", fontSize: "28px" }} />
              <MUIIcon.Reddit sx={{ color: "#ff0000", fontSize: "28px" }} />
            </MUI.Stack>
          </MUI.Grid>
          <MUI.Grid item sm={7}>
            <MUI.Stack gap={"0.8rem"}>
              <CustomTypography
                sx={{ marginTop: "0.5rem" }}
                fontSize={"header4"}
              >
                {product?.name}
              </CustomTypography>
              <MUI.Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
                <MUI.Stack
                  direction={"row"}
                  gap={"0.5rem"}
                  alignItems={"center"}
                >
                  <CustomTypography
                    fontSize={"header5"}
                    sx={{
                      fontWeight: (theme) => theme.fontWeight.semiBold,
                      color: (theme) => theme.customPalette.secondaryText,
                    }}
                  >
                    {currentProductVariant?.stars}
                  </CustomTypography>
                  <MUI.Rating size="small" />
                </MUI.Stack>
                <MUI.Divider orientation="vertical" flexItem />
                <MUI.Box>
                  <CustomTypography
                    as={"span"}
                    fontSize={"header5"}
                    sx={{
                      fontWeight: (theme) => theme.fontWeight.semiBold,
                      color: (theme) => theme.customPalette.secondaryText,
                    }}
                  >
                    {currentProductVariant?.rating}
                  </CustomTypography>{" "}
                  <CustomTypography as={"span"}>Ratings</CustomTypography>
                </MUI.Box>
                <MUI.Divider orientation="vertical" flexItem />
                <MUI.Box>
                  <CustomTypography
                    fontSize={"header5"}
                    as={"span"}
                    sx={{
                      fontWeight: (theme) => theme.fontWeight.semiBold,
                      color: (theme) => theme.customPalette.secondaryText,
                    }}
                  >
                    {currentProductVariant?.sold}
                  </CustomTypography>{" "}
                  <CustomTypography as={"span"}>Sold</CustomTypography>
                </MUI.Box>
              </MUI.Stack>
              <MUI.Stack sx={{ marginTop: "0.5rem" }}>
                <CustomTypography
                  sx={{
                    color: (theme) => theme.customPalette.main,
                    fontWeight: (theme) => theme.fontWeight.semiBold,
                    fontSize: (theme) =>
                      theme.customTypography.fontSizes.header3,
                  }}
                >
                  {currentProductVariant?.price &&
                    formatCurrency(currentProductVariant.price)}
                </CustomTypography>
              </MUI.Stack>
              <ProductDetailInformationOptions
                index={index}
                currentProduct={currentProductVariant}
                changeVariant={changeVariant}
              />
            </MUI.Stack>
          </MUI.Grid>
        </MUI.Grid>
      </ContentWrapper>
      <ContentWrapper sx={{ marginBottom: "1rem" }}>
        <ContentWrapper
          sx={{ backgroundColor: (theme) => theme.customPalette.grey10 }}
        >
          <CustomTypography
            variant="h2"
            sx={{
              fontSize: (theme) => theme.customTypography.fontSizes.body1,
            }}
          >
            Description
          </CustomTypography>
        </ContentWrapper>
        <ContentWrapper>
          <CustomTypography>{product?.description ?? ""}</CustomTypography>
        </ContentWrapper>
      </ContentWrapper>
    </>
  );
};
