import { Product } from "@shopifize/helpers";
import { ProductVariantCard } from "./product-variant-card";
import { useState } from "react";
import { CustomButton, CustomIconButton, MUI, MUIIcon } from "@shopifize/ui";

export const ProductVariantList = (props: { data: Product | undefined }) => {
  const { data } = props;
  const [show, setShow] = useState(false)

  return <MUI.Box>
    <MUI.Stack direction={'column'} alignItems={'center'} sx={{ display: show ? 'none' : 'flex' }}>
      <CustomButton
        onClick={
          () => { setShow(true) }
        }
        variant="outlined"
        endIcon={<MUIIcon.ExpandMore />}
      >
        {data?.productVariants.length.toString()} variant(s)
      </CustomButton>
    </MUI.Stack>
    <MUI.Stack sx={{ display: show ? 'flex' : 'none' }} gap={'1rem'}>
      {data?.productVariants.map((variant) => {
        return <ProductVariantCard key={variant.id} productVariant={variant} />
      })}
    </MUI.Stack>
    <MUI.Stack direction={'column'} alignItems={'center'} sx={{ display: show ? 'flex' : 'none', marginTop: '0.5rem' }}>
      <CustomIconButton
        sx={{ aspectRatio: '1 / 1' }}
        onClick={
          () => { setShow(false) }
        }
      >
        <MUIIcon.ExpandLess />
      </CustomIconButton>
    </MUI.Stack>
  </MUI.Box>
}
