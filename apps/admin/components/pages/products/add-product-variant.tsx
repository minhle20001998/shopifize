import { CustomColorPicker, CustomInput, NumberInput } from "@shopifize/ui";
import { AddProductVariantContainer } from "./add-product-variant-container";
import { ProductFormType } from "./add-product-form";
import { FieldArrayRenderProps, FormikProps, getIn } from "formik";
import { memo, useId, useState } from "react";
import { FileBrowser } from "~/components/common";
import { ProviderContext, useSnackbar } from "notistack";

interface Props {
  index: number;
  formik: FormikProps<ProductFormType>;
  arrayHelpers: FieldArrayRenderProps;
  isLast: boolean;
  isFirst: boolean;
  isEdit: boolean;
  snackbar: ProviderContext
}

const AddProductVariant = (props: Props) => {
  const id1 = useId()
  const { index, formik, isLast, isFirst, arrayHelpers, isEdit, snackbar } = props;
  const [enableEdit, setEnableEdit] = useState(false)
  const id = getIn(formik.values, `productVariants.${index}.id`)

  const isDisable = !isEdit || !!!id ? false : !enableEdit
  return <AddProductVariantContainer
    isLast={isLast}
    isFirst={isFirst}
    formik={formik}
    arrayHelpers={arrayHelpers}
    index={index}
    isEdit={isEdit}
    enableEdit={enableEdit}
    setEnableEdit={setEnableEdit}
  >
    <CustomInput
      label="Description"
      arrayName={`productVariants.${index}.description`}
      formik={formik}
      disabled={isDisable}
    />
    <CustomColorPicker label="Color" arrayName={`productVariants.${index}.color`} formik={formik} />
    {/* <CustomInput
      innerInputSx={{ backgroundColor: (theme) => theme.customPalette.white }}
      label="Image preview"
      arrayName={`productVariants.${index}.imgSrc`}
      formik={formik}
      disabled={isDisable}
    /> */}
    <FileBrowser
      label="Image Preview"
      arrayName={`productVariants.${index}.imgSrc`}
      formik={formik}
      snackbar={snackbar}
    />
    <NumberInput
      label="Quantity"
      arrayName={`productVariants.${index}.quantity`}
      formik={formik}
      disabled={isDisable}
    />
    <NumberInput
      label="Price"
      arrayName={`productVariants.${index}.price`}
      formik={formik}
      disabled={isDisable}
    />
    <NumberInput
      label="Sale Price"
      arrayName={`productVariants.${index}.salePrice`}
      formik={formik}
      disabled={isDisable}
    />
  </AddProductVariantContainer>
}


export const MemoizedAddProductVariant = memo(AddProductVariant, (prevProps, nextProps) => {
  const { index: prevIndex, formik: prevFormik } = prevProps;
  const { index: nextIndex, formik: nextFormik } = nextProps;


  const checkUnchanged = (field: string) => {
    
    const prevFieldValue = getIn(nextFormik?.values, `productVariants.${nextIndex}.${field}`)
    const nextFieldValue = getIn(prevFormik?.values, `productVariants.${nextIndex}.${field}`)
    const isFieldUnChanged = prevFieldValue?.length !== nextFieldValue?.length ? false : prevFieldValue === nextFieldValue
    if(!isFieldUnChanged) {
      return false
    }
    const prevFieldTouched = getIn(nextFormik?.touched, `productVariants.${nextIndex}.${field}`)
    const nextFieldTouched = getIn(prevFormik?.touched, `productVariants.${nextIndex}.${field}`)
    const isFieldErrorUnChanged = prevFieldTouched === nextFieldTouched
    if(!isFieldErrorUnChanged) {
      return false
    }
    const prevFieldError = getIn(nextFormik?.errors, `productVariants.${nextIndex}.${field}`)
    const nextFieldError = getIn(prevFormik?.errors, `productVariants.${nextIndex}.${field}`)
    const isFieldTouchedUnChanged = prevFieldError === nextFieldError
    return isFieldUnChanged && isFieldErrorUnChanged && isFieldTouchedUnChanged
  }


  //
  const checkDescription = checkUnchanged('description')
  const checkColor = checkUnchanged('color')
  const checkImagePreview = checkUnchanged('imgSrc')
  const checkPrice = checkUnchanged('price')
  const checkSalePrice = checkUnchanged('salePrice')
  const checkQuantity = checkUnchanged('quantity')
  const checkIndex = prevIndex === nextIndex



  if (checkIndex && checkDescription && checkColor && checkImagePreview && checkPrice && checkSalePrice && checkQuantity) {
    return true;
  }

  return false;
})