import { MUI } from "@shopifize/ui";
import { ProductDetailInformation } from "./components";
import { ProductDetailComment } from "./components/product-detail-comment";
import { useState } from "react";

interface Props {
  id?: string;
}

export const ProductDetailContent = ({ id }: Props) => {
  const [productVariantId, setProductVariantId] = useState<string | undefined>(
    undefined
  );

  return (
    <MUI.Stack>
      <ProductDetailInformation
        id={id}
        setProductVariantId={setProductVariantId}
      />
      <ProductDetailComment id={id} productVariantId={productVariantId} />
    </MUI.Stack>
  );
};
