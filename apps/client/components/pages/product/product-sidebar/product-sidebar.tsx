import { MUI } from "@shopifize/ui";
import { useRouter } from "next/router";
import { useGetSubCategoriesQuery } from "~/queries";
import { ProductSidebarCategories } from "./product-sidebar-categories";
import { ProductSidebarFilter } from "./product-sidebar-filter";

export const ProductSidebar = () => {
  const router = useRouter();
  const categoryName = router.query.category;
  const subCategoryName = router.query["sub-category"];
  const { data: subCategories } = useGetSubCategoriesQuery({
    categoryName: categoryName?.toString(),
  });

  return (
    <MUI.Stack direction={"column"} sx={{ padding: "1rem" }} gap={"1rem"}>
      <ProductSidebarCategories
        categoryName={categoryName}
        subCategories={subCategories}
        subCategoryName={subCategoryName}
      />
      <MUI.Divider />
      <ProductSidebarFilter />
    </MUI.Stack>
  );
};
