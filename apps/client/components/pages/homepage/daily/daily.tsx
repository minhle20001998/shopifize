import React from "react";
import { ContentTitle, ContentWrapper, ProductItem } from "~/components/ui";
import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useGetNewProductsQuery } from "~/queries/products";

const Daily = () => {
  const theme = useTheme();

  const { data: newProducts } = useGetNewProductsQuery();

  return (
    <ContentWrapper isTransparent>
      <ContentTitle>
        <CustomTypography
          sx={{
            textTransform: "uppercase",
            color: theme.customPalette.main,
          }}
        >
          Today Newest
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
      <MUI.Stack direction={"row"} justifyContent={"center"} marginTop={"2rem"}>
        <MUI.Button
          sx={{
            width: "100%",
            maxWidth: "25rem",
            backgroundColor: "common.white",
            border: "1px solid black",
            borderColor: theme.customPalette.main,
          }}
        >
          See more
        </MUI.Button>
      </MUI.Stack>
    </ContentWrapper>
  );
};

export default Daily;
