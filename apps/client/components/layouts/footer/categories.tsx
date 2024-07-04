import React from "react";
import FooterLink from "./footer-link";
import { MUI } from "@shopifize/ui";
import { useGetCategoriesQuery } from "~/queries";
import { SubCategory } from "@shopifize/helpers";

const CategoriesGrid = () => {
  const { data: categoriesData } = useGetCategoriesQuery();

  return (
    <MUI.Stack gap={"1.2rem"}>
      <MUI.Grid container rowSpacing={4} columns={20}>
        {categoriesData?.data.data.map((category) => {
          return (
            <CategoryCell
              key={category.id}
              name={category.name}
              subCategories={category.subCategory}
            />
          );
        })}
      </MUI.Grid>
    </MUI.Stack>
  );
};

const CategoryCell = ({
  name,
  subCategories,
}: {
  name: string;
  subCategories: SubCategory[];
}) => {
  return (
    <MUI.Grid item xs={10} sm={5} lg={4}>
      <MUI.Stack gap={"0.5rem"}>
        <FooterLink isTitle href={""}>
          {name}
        </FooterLink>
        {subCategories.map((subCategory) => {
          return (
            <FooterLink key={subCategory.id} href={""}>
              {subCategory.name}
            </FooterLink>
          );
        })}
      </MUI.Stack>
    </MUI.Grid>
  );
};

export default CategoriesGrid;
