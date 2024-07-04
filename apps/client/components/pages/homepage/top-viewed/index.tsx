import React from "react";
import { ContentTitle, ContentWrapper, ProductItem } from "~/components/ui";
import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useGetNewProductsQuery } from "~/queries/products";

const TopViewed = () => {
  const theme = useTheme();

  const { data: newProducts } = useGetNewProductsQuery();

  return (
    <ContentWrapper>
      <ContentTitle isLeftSide>
        <CustomTypography
          sx={{
            textTransform: "uppercase",
            color: theme.customPalette.main,
            fontSize: theme.customTypography.fontSizes.header4,
          }}
        >
          Today Top Sale
        </CustomTypography>
      </ContentTitle>
      <MUI.Grid container spacing={"8px"}>
        {newProducts?.data ? (
          newProducts?.data.map((newProduct) => {
            const firstProduct = newProduct.productVariants[0];
            return (
              <MUI.Grid key={newProduct.id} item xs={6} sm={4} md={3} lg={2}>
                <MUI.Stack direction={"row"} justifyContent={"center"}>
                  <ProductItem
                    id={newProduct.id}
                    img={firstProduct.imgSrc}
                    category={newProduct.category.name}
                    price={firstProduct.price}
                    sold={firstProduct.productStatus.sold}
                    title={newProduct.name}
                  />
                </MUI.Stack>
              </MUI.Grid>
            );
          })
        ) : (
          <></>
        )}
      </MUI.Grid>
    </ContentWrapper>
  );
};

export default TopViewed;