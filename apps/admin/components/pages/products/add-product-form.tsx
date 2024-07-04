import { CustomInput, CustomSelect, CustomTextarea, CustomTypography, MUI, Options } from "@shopifize/ui"
import { FieldArray, FieldArrayRenderProps, FormikProvider, useFormik } from "formik"
import * as Yup from 'yup'
import { AddProductButton } from "./add-product-button"
import { MemoizedAddProductVariant } from "./add-product-variant"
import { Category } from "@shopifize/helpers"
import { ProviderContext } from "notistack"
import { useGetSubCategoriesQuery } from "~/queries/sub-categories"

export interface AddProductFormProps {
  values?: ProductFormType
  categories: Category[]
  snackbar: ProviderContext
  onSubmit: (values: ProductFormType) => void
}

const URL = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

const validationSchema = Yup.object().shape({
  productName: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category name is required'),
  subCategory: Yup.array().of(Yup.string().required()).min(1, 'Sub category is required').required('Sub Category is required'),
  productVariants: Yup.array().of(Yup.object().shape({
    id: Yup.string().optional(),
    isNew: Yup.boolean().optional(),
    description: Yup.string().required('Description is required'),
    color: Yup.string().required('Color is required'),
    imgSrc: Yup.string().matches(URL, { message: 'Please enter a valid URL' }).required('Image source is required'),
    quantity: Yup.number().min(1, 'Price must be greater or equal to 0').required('Quantity is required'),
    price: Yup.number().min(1, 'Price must be greater than 0').required('Price is required'),
    salePrice: Yup.number().lessThan(Yup.ref('price'), 'Sale price must be less than price').optional().nullable()
  })).min(1, 'Variant is required').required('Product Variant is required')
})

export type ProductFormType = Yup.InferType<typeof validationSchema>;

export const AddProductForm = (props: AddProductFormProps) => {

  const { values, categories, snackbar, onSubmit } = props

  const categoryOptions = categories.map<Options>((category) => {
    return {
      id: category.id,
      label: category.name
    }
  })

  const isEdit = !!values

  const initialValues: ProductFormType = {
    productName: values?.productName ?? '',
    description: values?.description ?? '',
    category: values?.category ?? '',
    subCategory: values?.subCategory ?? [],
    productVariants: values?.productVariants ?? []
  }

  const formik = useFormik({ initialValues, validationSchema, onSubmit, enableReinitialize: true })

  const handleAddVariant = (arrayHelpers: FieldArrayRenderProps) => () => {
    arrayHelpers.push({ isNew: true, description: '', color: '', imgSrc: '', price: 0, quantity: 0, salePrice: undefined })
  }

  const {data: subCategories} = useGetSubCategoriesQuery(formik.values.category,  { enabled: !!formik.values.category, staleTime: Infinity })

  const subCategoryOptions = subCategories?.data.map<Options>((subCategory) => {
    return {
      id: subCategory.id,
      label: subCategory.name
    }
  })

  const isVariantError = typeof formik.errors.productVariants === 'string' && !!formik.touched.productVariants

  return <MUI.Grid container>
    <MUI.Grid item xl={6} sm={12}>
      <form id={isEdit ? "edit-product-form" : "add-product-form"} onSubmit={formik.handleSubmit}>
        <CustomInput name='productName' label="Product Name" formik={formik} />
        <CustomSelect options={categoryOptions} name='category' label="Categories" formik={formik} />
        <CustomSelect
          multiple
          disabled={!formik.values.category}
          options={subCategoryOptions}
          name='subCategory'
          label="Sub categories"
          formik={formik}
        />
        <CustomTextarea label="Description" name="description" formik={formik}/>
        <CustomTypography
          sx={{
            marginBottom: !isVariantError ? "0.2rem" : undefined
          }}
        >
          Variants
        </CustomTypography>
        {isVariantError
          ? <MUI.FormControl
            sx={{
              marginBottom: isVariantError ? "0.2rem" : undefined
            }}
            error={isVariantError}
          >
            <MUI.FormHelperText
              sx={{ padding: 0, margin: 0 }}
            >
              {typeof formik.errors.productVariants === 'string' && formik.errors.productVariants}
            </MUI.FormHelperText>
          </MUI.FormControl>
          : <></>
        }
        {/* --------- VARIANTS --------- */}
        <FormikProvider value={formik}>
          <FieldArray name="productVariants" render={(arrayHelpers) => {
            return <>
              {formik.values.productVariants && formik.values.productVariants.length > 0
                ? formik.values.productVariants.map((_, index) => {
                  const isLast = index === (formik.values.productVariants as unknown[]).length - 1
                  const isFirst = index === 0
                  return <>
                    <MemoizedAddProductVariant
                      snackbar={snackbar}
                      isEdit={isEdit}
                      isLast={isLast}
                      isFirst={isFirst}
                      arrayHelpers={arrayHelpers}
                      formik={formik}
                      index={index}
                      key={index}
                    />
                  </>
                })
                : <></>
              }
              <AddProductButton onClick={handleAddVariant(arrayHelpers)} />
            </>
          }} />
        </FormikProvider>
      </form>
    </MUI.Grid>
  </MUI.Grid>
}