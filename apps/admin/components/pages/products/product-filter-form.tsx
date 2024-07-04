import { CustomInput, CustomSelect } from "@shopifize/ui"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useGetCategoriesQuery } from "~/queries/categories"
import { useGetSubCategoriesQuery } from "~/queries/sub-categories"

interface Props {
  onSubmit: (values: ProductFilterValues) => void
}

export interface ProductFilterValues {
  name?: string
  categoryId?: string
  subCategoryId?: string[]
}

export const ProductFilterForm = (props: Props) => {
  const { onSubmit } = props;
  const { query } = useRouter()
  const subCategoryId = query.subCategoryId as (string[] | string | undefined)
  const initialValues: ProductFilterValues = {
    name: query.name?.toString() ?? '',
    categoryId: query.categoryId?.toString() ?? '',
    subCategoryId: subCategoryId ? Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId] : []
  }
  const formik = useFormik({ initialValues, onSubmit })
  const { data } = useGetCategoriesQuery()
  const categories = data?.data
  const { data: subCategories } = useGetSubCategoriesQuery(formik.values.categoryId, { enabled: !!formik.values.categoryId })

  return <>
    <form id='product-filter-form' onSubmit={formik.handleSubmit}>
      <CustomInput
        name='name'
        formik={formik}
        label="Name"
      />
      <CustomSelect
        name='categoryId'
        formik={formik}
        options={categories?.data.map((category) => {
          return {
            id: category.id,
            label: category.name
          }
        })}
        label="Category"
      />
      <CustomSelect
        name='subCategoryId'
        formik={formik}
        options={subCategories?.data.map((subCategory) => {
          return {
            id: subCategory.id,
            label: subCategory.name
          }
        })}
        label="Sub Category"
        multiple
      />
    </form>
  </>
}