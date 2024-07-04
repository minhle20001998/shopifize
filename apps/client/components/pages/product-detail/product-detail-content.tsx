import { MUI } from "@shopifize/ui";
import { ProductDetailInformation } from "./components";
import { ProductDetailComment } from "./components/product-detail-comment";

interface Props {
  id?: string;
}

export const ProductDetailContent = ({ id }: Props) => {
  return (
    <MUI.Stack>
      <ProductDetailInformation id={id} />
      <ProductDetailComment id={id} />
    </MUI.Stack>
  );
};
