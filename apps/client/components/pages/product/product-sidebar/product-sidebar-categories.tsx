import { ResponseType, SubCategory } from "@shopifize/helpers";
import { CustomLink, MUI, MUIIcon, useTheme } from "@shopifize/ui";

interface Props {
  subCategories?: ResponseType<SubCategory[]>;
  subCategoryName?: string | string[];
  categoryName?: string | string[];
}

export const ProductSidebarCategories = (props: Props) => {
  const { subCategories, subCategoryName, categoryName } = props;
  const theme = useTheme();
  return (
    <>
      <MUI.Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
        <MUIIcon.List />
        <CustomLink
          variant="black"
          hoverStyle="color"
          href={"/"}
          sx={{ fontSize: theme.customTypography.fontSizes.header5 }}
        >
          All Categories
        </CustomLink>
      </MUI.Stack>
      <MUI.Divider />
      <MUI.Stack gap={"1.2rem"}>
        {subCategories?.data.map((subCategory) => {
          const isActive = subCategory.name === subCategoryName;
          return (
            <CustomLink
              sx={{
                fontSize: theme.customTypography.fontSizes.header5,
                color: isActive
                  ? theme.customPalette.main
                  : theme.customPalette.grey70,
                "&:hover": {
                  color: theme.customPalette.main,
                },
              }}
              hoverStyle="color"
              key={subCategory.id}
              href={`/category/${categoryName?.toString() ?? ""}/${
                subCategory.name
              }`}
            >
              {subCategory.name}
            </CustomLink>
          );
        })}
      </MUI.Stack>
    </>
  );
};
