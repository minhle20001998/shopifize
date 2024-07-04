import { CustomButton } from "@shopifize/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { ReactElement, useState } from "react";
import { ContentCard } from "~/components/common";
import { DashboardLayout, Protected } from "~/components/layouts";
import { EditProductForm, ProductFormType } from "~/components/pages";
import ProductProvider from "~/contexts/ProductActionContext";
import { NextPageWithLayout } from "~/pages/_app";
import { useGetCategoriesQuery } from "~/queries/categories";
import { useGetProductQuery, useInvalidateProductQuery, useUpdateProductMutation } from "~/queries/products";

type RequiredProperties<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

const ProductEditPage: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id
  const snackbar = useSnackbar()
  const { enqueueSnackbar } = snackbar
  const [editVariantIds, setEditVariantIds] = useState<string[]>([])
  const [deleteVariantIds, setDeleteVariantIds] = useState<string[]>([])
  const { data: categories } = useGetCategoriesQuery(undefined, {staleTime: Infinity})
  const { data: product } = useGetProductQuery(id?.toString() ?? '', {enabled: !!id?.toString()})
  const { mutateAsync: editProduct, isLoading: editProductLoading } = useUpdateProductMutation()
  const { invalidateProductQuery } = useInvalidateProductQuery()
  const values = product?.data ? {
    category: product.data.category.id,
    productName: product.data.name,
    description: product.data.description,
    productVariants:
      product.data.productVariants?.map((value) => {
        return {
          ...value,
          quantity: value.productStatus.quantity
        }
      }),
    subCategory: product.data.subCategory?.map((value) => value.id)
  } : undefined

  const handleSubmit = async (formValues: ProductFormType) => {
    if (id) {
      const updateVariants: ProductFormType['productVariants'][number][] = []
      const addVariants: ProductFormType['productVariants'][number][] = []
      formValues.productVariants.forEach((variant) => {
        if (variant.isNew === true) {
          addVariants.push(variant)
        } else if (variant.id && editVariantIds.includes(variant.id)) {
          updateVariants.push(variant)
        }
      })

      const mappingValue = {
        name: formValues.productName,
        description: formValues.description,
        categoryId: formValues.category,
        subCategoryId: formValues.subCategory,
        addProductVariants: addVariants,
        updateProductVariants: updateVariants as RequiredProperties<ProductFormType['productVariants'][number]>[],
        deleteProductVariants: deleteVariantIds
      }

      await editProduct({ ...mappingValue, id: id.toString() }, {
        onSuccess: () => {
          enqueueSnackbar('Product updated successfully', { variant: 'success' })
          invalidateProductQuery(id?.toString())
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })

    }
  }

  return <>
    <Head>
      <title>Shopifize - Edit Product</title>
    </Head>

    <ContentCard>
      <ContentCard.Title>
        Edit Product
      </ContentCard.Title>
      <ContentCard.Body>
        <ProductProvider
          deleteVariantIds={deleteVariantIds}
          editVariantIds={editVariantIds}
          setDeleteVariantIds={setDeleteVariantIds}
          setEditVariantIds={setEditVariantIds}
        >
          {values
            ?
            <EditProductForm
              snackbar={snackbar}
              values={values}
              categories={categories?.data.data || []}
              onSubmit={handleSubmit} />
            : <></>
          }
        </ProductProvider>
      </ContentCard.Body>
    </ContentCard>
    <CustomButton
      disabled={editProductLoading}
      type="submit"
      form="edit-product-form"
      fullWidth={false}
      sx={{ marginTop: '1rem' }}
    >
      Save
    </CustomButton>
  </>
}

ProductEditPage.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export default ProductEditPage