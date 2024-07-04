import Link from "next/link";
import React, { useState } from "react";
import { ContentWrapper } from "~/components/ui";
import categoryIcons, { CATEGORY_ICON_SIZE } from "./category-icons";
import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import { useGetCategoriesQuery } from "~/queries";

const Categories = () => {
  const { data: categoriesData } = useGetCategoriesQuery();
  return (
    <ContentWrapper sx={{ padding: "16px" }}>
      <MUI.Grid container columns={12}>
        {categoriesData?.data.data.map((category) => {
          const icon = categoryIcons[category.name];
          const title = category.name;
          return (
            <CategoryGridItem
              key={category.id}
              icon={icon}
              title={title}
              subCategoryTitle={category.subCategory[0].name}
            />
          );
        })}
      </MUI.Grid>
    </ContentWrapper>
  );
};

interface ICategoryGridProps {
  icon: React.ReactNode;
  title: string;
  subCategoryTitle: string;
}

const CategoryGridItem = (props: ICategoryGridProps) => {
  const [onHover, setOnHover] = useState(false);

  const theme = useTheme();

  return (
    <MUI.Grid item xs={6} md={3} lg={2}>
      <Link
        href={`/category/${props.title}/${props.subCategoryTitle}`}
        style={{ textDecoration: "none" }}
        onMouseOver={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        <MUI.Stack
          alignItems={"center"}
          justifyContent={"center"}
          minHeight={"120px"}
        >
          <StyledIconWrapper
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              width: !onHover ? "64px" : "72px",
              height: !onHover ? "64px" : "72px",
              boxShadow: onHover
                ? `0px 0px 10px ${theme.customPalette.main}`
                : theme.boxShadows.depth8,
              "& svg": {
                color: onHover
                  ? theme.customPalette.main
                  : theme.customPalette.grey80,
                width: onHover ? "40px" : CATEGORY_ICON_SIZE,
                height: onHover ? "40px" : CATEGORY_ICON_SIZE,
                transition: "all 0.2s",
              },
            }}
          >
            {props.icon}
          </StyledIconWrapper>
          <CustomTypography
            sx={{
              fontSize: theme.customTypography.fontSizes.body2,
              textTransform: "capitalize",
              marginTop: "8px",
              color: onHover ? theme.customPalette.main : "",
            }}
          >
            {props.title}
          </CustomTypography>
        </MUI.Stack>
      </Link>
    </MUI.Grid>
  );
};

const StyledIconWrapper = MUI.styled(MUI.Stack)(({ theme }) => {
  return {
    borderRadius: "100%",
    background: theme.customPalette.grey10,
    transition: "all 0.2s",
  };
});

export default Categories;
