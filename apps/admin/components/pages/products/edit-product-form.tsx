import { AddProductForm, AddProductFormProps } from "./add-product-form"

type EditProductFormProps = AddProductFormProps

export const EditProductForm = (props: EditProductFormProps) => {
  return <AddProductForm {...props}/>
}