import { CustomButton, usePaginationQuery } from "@shopifize/ui";
import Head from "next/head";
import Router from "next/router";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import { ContentCard } from "~/components/common";
import { DashboardLayout, Protected } from "~/components/layouts";
import { AddProductForm, ProductFormType } from "~/components/pages";
import { Routes } from "~/const";
import { NextPageWithLayout } from "~/pages/_app";
import { useGetCategoriesQuery } from "~/queries/categories";
import { useAddProductMutation } from "~/queries/products";

const ProductAddPage: NextPageWithLayout = () => {
  const snackbar = useSnackbar()
  const { enqueueSnackbar } = snackbar
  const {mutate} = useAddProductMutation()
  const {data: categories} = useGetCategoriesQuery({skip: 0, limit: -1})


  const handleSubmit = (formValues: ProductFormType) => {
    const mappingValue = {
      name: formValues.productName,
      description: formValues.description,
      categoryId: formValues.category,
      subCategoryId: formValues.subCategory,
      productVariants: formValues.productVariants
    }
    mutate(mappingValue, {
      onSuccess: () => {
        enqueueSnackbar('Add product successfully', { variant: 'success' })
        Router.push(Routes.PRODUCTS)
      }
    })
  }

  return <>
    <Head>
      <title>Shopifize - Add Product</title>
    </Head>
    <ContentCard>
      <ContentCard.Title>
        Add Product
      </ContentCard.Title>
      <ContentCard.Body>
        <AddProductForm categories={categories?.data.data || []} snackbar={snackbar} onSubmit={handleSubmit} />
      </ContentCard.Body>
    </ContentCard>
    <CustomButton
      type="submit"
      form="add-product-form"
      fullWidth={false}
      sx={{ marginTop: '1rem' }}
    >
      Save
    </CustomButton>
  </>
}

ProductAddPage.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export default ProductAddPage