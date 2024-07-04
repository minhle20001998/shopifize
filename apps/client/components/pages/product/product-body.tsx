import { MUI, useTheme } from "@shopifize/ui";
import { ProductSidebar } from "./product-sidebar/product-sidebar";
import { ProductContentSort } from "./product-content/product-content-sort";
import { ProductContent } from "./product-content/product-content";

export const ProductBody = () => {
  const theme = useTheme();

  return (
    <MUI.Stack direction={"row"}>
      <MUI.Box sx={{ flexBasis: "240px" }}>
        <ProductSidebar />
      </MUI.Box>
      <MUI.Stack sx={{ flex: 1, padding: "1rem", gap: "1rem" }}>
        <MUI.Box
          sx={{
            padding: "1rem",
            backgroundColor: theme.customPalette.background,
            borderRadius: theme.borderRadius[4],
          }}
        >
          <ProductContentSort />
        </MUI.Box>
        <MUI.Box
          sx={{
            borderRadius: theme.borderRadius[4],
          }}
        >
          <ProductContent />
        </MUI.Box>
      </MUI.Stack>
    </MUI.Stack>
  );
};
