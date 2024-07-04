import { CustomButton, CustomTypography, MUI } from "@shopifize/ui";
import { useRouter } from "next/router";
import { ReactSVG } from "react-svg";
import { ProductItem } from "~/components/ui";
import { ProductItemSkeleton } from "~/components/ui/product-item.skeleton";
import { useGetProductsQuery } from "~/queries/products";

export const ProductContent = () => {
  const router = useRouter();
  const category = router.query.category?.toString();
  const subCategory = router.query["sub-category"]?.toString();
  const startPrice = router.query.startPrice?.toString();
  const endPrice = router.query.endPrice?.toString();
  const rating = router.query.rating?.toString();
  const onSale = router.query.onSale?.toString();
  const limit = 20;

  const { data: products, isLoading } = useGetProductsQuery(
    {
      category: category!,
      subCategory: subCategory!,
      startPrice,
      endPrice,
      rating,
      onSale,
    },
    { enabled: !!category && !!subCategory }
  );

  const productData = products?.data.data;

  if (isLoading) {
    return (
      <MUI.Grid container spacing={2}>
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <MUI.Grid key={index} item xl={3} md={4} sm={6}>
                <ProductItemSkeleton key={index} />
              </MUI.Grid>
            );
          })}
      </MUI.Grid>
    );
  }

  return productData && productData.length > 0 ? (
    <>
      <MUI.Grid container spacing={2}>
        {productData.map((product) => {
          return (
            <MUI.Grid key={product.id} item xl={3} md={4} sm={6}>
              <ProductItem
                id={product.id}
                category={product.category.name}
                img={product.productVariants?.[0].imgSrc}
                price={product.productVariants?.[0].price}
                title={product.name}
                sold={product.productVariants?.[0].productStatus.sold}
                votes={product.productVariants?.[0].productStatus.rating}
              />
            </MUI.Grid>
          );
        })}
      </MUI.Grid>
      <MUI.Stack alignItems={"center"}>
        <MUI.Pagination
          color="primary"
          shape="rounded"
          count={Math.ceil(products.data.total / limit)}
          size="large"
        />
      </MUI.Stack>
    </>
  ) : (
    <MUI.Stack
      gap={"2rem"}
      sx={{
        alignItems: "center",
        marginTop: "3rem",
        "& svg": {
          maxWidth: "300px",
          width: "100%",
          height: "300px",
        },
      }}
    >
      <ReactSVG
        style={{ marginRight: "100px" }}
        width={"400px"}
        src={"https://d2cbrs5b3atqbl.cloudfront.net/common/no_data.svg"}
      />
      <CustomTypography
        fontSize={"header3"}
        sx={{ color: (theme) => theme.customPalette.grey80 }}
      >
        No Product Found
      </CustomTypography>
      <CustomButton href="/" fullWidth={false} variant="outlined">
        Return To Home Page
      </CustomButton>
    </MUI.Stack>
  );
};
