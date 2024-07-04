import { ProductVariant } from "@shopifize/helpers"
import { CustomColorPicker, CustomTypography, MUI } from "@shopifize/ui"

export const ProductVariantCard = (props: {
  productVariant: ProductVariant
}) => {
  const { productVariant } = props

  return <MUI.Card sx={{
    backgroundColor: (theme) => theme.customPalette.grey10,
    padding: '1rem',
    boxShadow: (theme) => theme.boxShadows.depth4
  }}>
    <MUI.CardMedia
      sx={{ height: 300 }}
      image={productVariant.imgSrc}
      title={productVariant.description}
    />
    <MUI.Stack direction={'column'} gap={'0.5rem'} marginTop={'0.5rem'} >
      <MUI.Grid container alignItems={'center'} spacing={4}>
        <MUI.Grid item sm={3}>
          <CustomTypography><b>Color</b>:</CustomTypography>
        </MUI.Grid>
        <MUI.Grid item sm={9}>
          <CustomColorPicker value={productVariant.color} disabled helperTextHidden />
        </MUI.Grid>
      </MUI.Grid>
      <MUI.Grid container alignItems={'center'} spacing={4}>
        <MUI.Grid item sm={3}>
          <CustomTypography><b>Description</b>: </CustomTypography>
        </MUI.Grid>
        <MUI.Grid item sm={9} >
          <CustomTypography>{productVariant.description}</CustomTypography>
        </MUI.Grid>
      </MUI.Grid>
      <MUI.Grid container alignItems={'center'} spacing={4}>
        <MUI.Grid item sm={3}>
          <CustomTypography><b>Price</b>:</CustomTypography>
        </MUI.Grid>
        <MUI.Grid item sm={9}>
          <CustomTypography>{productVariant.price}</CustomTypography>
        </MUI.Grid>
      </MUI.Grid>
      <MUI.Grid item>
        {productVariant.salePrice
          ? <>
            <MUI.Grid container>
              <MUI.Grid item sm={2}>
                <CustomTypography><b>Sale Price</b>:</CustomTypography>
              </MUI.Grid>
              <MUI.Grid item sm={10}>
                <CustomTypography>{productVariant.salePrice}</CustomTypography>
              </MUI.Grid>
            </MUI.Grid>
          </>
          : <></>
        }
      </MUI.Grid>
    </MUI.Stack>
  </MUI.Card>
}