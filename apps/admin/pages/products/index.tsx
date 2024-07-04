/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { DashboardLayout, Protected } from "~/components/layouts";
import { NextPageWithLayout } from "../_app";
import { Column, CustomButton, CustomChip, CustomTable, CustomModal, MUIIcon, MUI, CustomDrawer, useOpenState, usePaginationQuery } from "@shopifize/ui";
import { ContentCard } from "~/components/common";
import { Product, StatusCode, removeEmptyValues } from "@shopifize/helpers";
import { ProductFilterForm, ProductFilterValues, ProductVariantList } from "~/components/pages";
import { ContentCardHeader } from "~/components/common/content-card";
import { Routes } from "~/const";
import { useSnackbar } from "notistack";
import Router, { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import Link from "next/link";
import { useDeepCompareMemo } from "use-deep-compare";
import { useDeleteProductMutation, useGetProductsQuery, useInvalidateProductQuery } from "~/queries/products";
import { getAxiosStatusCodeError } from "~/utils/axios/error-handler";
import { usePermissionAlert } from "~/contexts/PermissionAlertContext";

const ProductPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { limit, skip } = usePaginationQuery()
  const { setPermissionError, clearPermissionError } = usePermissionAlert()
  const [id, setId] = useState<string | undefined>(undefined)
  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useOpenState()
  const { isOpen: isFilterDrawerOpen, open: openFilterDrawer, close: closeFilterDrawer } = useOpenState()
  const { data: products, refetch } = useGetProductsQuery({
    limit: limit,
    skip: skip,
    name: query.name?.toString(),
    categoryId: query.categoryId?.toString(),
    subCategoryId: query.subCategoryId as (string[] | undefined),
  }, {
    onSuccess: () => {
      clearPermissionError()
    },
    onError: (err) => {
      if (getAxiosStatusCodeError(err) === StatusCode.Forbidden) {
        setPermissionError('View Products')
      }
    }
  })
  const { mutate: deleteProduct } = useDeleteProductMutation()

  useEffect(() => {
    return () => {
      clearPermissionError()
    }
  }, [])

  const columns = useDeepCompareMemo<Column<Product>[]>(() => {
    return [
      { id: 'name', name: 'Name' },
      {
        id: 'category', name: 'Categories', type: {
          custom: (data) => {
            return <>
              <Link href={`${Routes.CATEGORIES}/${data?.category.id}`}>
                <CustomChip
                  clickable
                  color="primary"
                  sx={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  label={data?.category.name}
                />
              </Link>
              {data?.subCategory?.map((subCategory) => {
                return <CustomChip sx={{ marginRight: '0.5rem' }} key={subCategory.id} label={subCategory.name} />
              })}
            </>
          }
        }
      },
      {
        id: 'productVariants',
        name: 'Product Variants',
        type: {
          custom: (data) => {
            return <ProductVariantList data={data} />
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        id: 'actions',
        name: 'Actions',
        type: {
          actions: [
            { variant: 'edit', name: 'Edit', href: (data) => { return `${Routes.PRODUCTS}/edit/${data.id}` } },
            {
              variant: 'delete', name: 'Delete', callback: (data) => {
                openDeleteModal()
                setId(data.id)
              }
            },
          ]
        }
      }
    ]
  }, [products?.data])

  const handleDelete = () => {
    if (id) {
      deleteProduct({ id }, {
        onSuccess: () => {
          enqueueSnackbar('Delete product successfully !', { variant: 'success' })
          refetch()
          closeDeleteModal()
        }
      })
    }
  }

  const handleFilterSubmit = (values: ProductFilterValues) => {
    Router.replace({
      pathname: location.pathname,
      query: removeEmptyValues({ ...values }) as ParsedUrlQueryInput
    })
  }

  const handleClearFilter = () => {
    Router.replace({
      pathname: location.pathname,
      search: ''
    })
  }

  return (
    <>
      <Head>
        <title>Shopifize - Products</title>
      </Head>
      {/* TABLE */}
      <ContentCard>
        <ContentCardHeader>
          <ContentCard.Title>
            Products
          </ContentCard.Title>
          <MUI.Stack direction={'row'} gap={'1rem'}>
            <CustomButton
              variant="text"
              color="success"
              onClick={openFilterDrawer}
              startIcon={<MUIIcon.FilterAlt />}
            >
              Filter
            </CustomButton>
            <CustomButton
              sx={{ padding: '0 16px' }}
              href="/products/add"
              startIcon={<MUIIcon.Add />}
            >
              Product
            </CustomButton>
          </MUI.Stack>
        </ContentCardHeader>
        <ContentCard.Body>
          <CustomTable
            data={products?.data.data || []}
            columns={columns}
            pagination={{
              total: products?.data.total || 0,
              limit: limit,
              skip: skip
            }}
          />
        </ContentCard.Body>
      </ContentCard>
      {/* DELETE MODAL */}
      <CustomModal
        title="Delete Product"
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        actionsProps={{
          applyButtonProps: {
            content: "Delete",
            color: "error",
            type: "button",
            onClick: handleDelete,
          },
          cancelButtonProps: {
            variant: "text",
            sx: { color: (theme) => theme.customPalette.grey100 },
            onClick: closeDeleteModal,
          },
        }}
      >
        Are you sure to delete this address ?
      </CustomModal>
      {/* FILTER DRAWER FORM */}
      <CustomDrawer
        header="Product Filter"
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={closeFilterDrawer}
        footer
        submitBtnProps={{
          form: 'product-filter-form',
          type: 'submit',
          children: 'Submit'
        }}
        cancelBtnProps={{
          variant: 'outlined',
          children: 'Clear',
          onClick: handleClearFilter
        }}
      >
        <ProductFilterForm onSubmit={handleFilterSubmit} />
      </CustomDrawer>
    </>
  );
};

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export default ProductPage;