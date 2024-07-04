import { removeEmptyValues } from "@shopifize/helpers";
import { CustomButton, CustomTypography, MUI } from "@shopifize/ui";
import Router, { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { removeSlugFromQuery } from "../product-sidebar/product-sidebar-filter-rating";

export const ProductContentSort = () => {
  const sortByOptions = [
    {
      id: "popular",
      name: "Popular",
    },
    {
      id: "latest",
      name: "Latest",
    },
    {
      id: "topSales",
      name: "Top sales",
    },
    {
      id: "priceAsc",
      name: "Price: Low to High",
    },
    {
      id: "priceDesc",
      name: "Price: High to Low",
    },
  ];

  const router = useRouter();
  const sortBy = router.query.sortBy?.toString();

  const onSortClick = (sortBy: string) => async () => {
    await Router.replace({
      pathname: location.pathname,
      query: removeEmptyValues({
        ...removeSlugFromQuery(router.query),
        sortBy,
      }) as ParsedUrlQueryInput,
    });
  };

  return (
    <MUI.Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
      <CustomTypography>Sort by</CustomTypography>
      <MUI.Stack
        direction={"row"}
        gap={"0.75rem"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        {sortByOptions.map((option, index) => {
          const isSelected =
            sortBy === option.id ? true : index === 0 && !sortBy;

          return (
            <CustomButton
              key={option.id}
              variant={isSelected ? "contained" : "text"}
              fullWidth={false}
              onClick={onSortClick(option.id)}
            >
              {option.name}
            </CustomButton>
          );
        })}
      </MUI.Stack>
    </MUI.Stack>
  );
};
