import { Category } from "@shopifize/helpers";
import { Column, CustomButton, CustomChip, CustomTable, DeleteConfirmationModal, MUI, MUIIcon, useOpenState, usePaginationQuery } from "@shopifize/ui";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { ChangeEvent, ReactElement, useRef, useState } from "react";
import { ContentCard } from "~/components/common";
import { ContentCardHeader } from "~/components/common/content-card";
import { DashboardLayout, Protected } from "~/components/layouts";
import { CategoryFormType, CategoryModal, SubCategoriesModal } from "~/components/pages";
import { Routes } from "~/const";
import { NextPageWithLayout } from "~/pages/_app";
import { useAddCategoryMutation, useDeleteCategoriesMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useGetCategoryQuery, useInvalidateCategoryQuery, useUpdateCategoryMutation, useUploadCategoriesMutation } from "~/queries/categories";
import { productClient } from "~/utils";

const CategoryPage: NextPageWithLayout = () => {
  const { limit, skip } = usePaginationQuery()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const slug = router.query.slug
  const { isOpen, open, close } = useOpenState()
  const [editId, setEditId] = useState<string | undefined>(slug ? slug.toString() : undefined)
  const { isOpen: isSubCategoryOpen, open: openSubCategories, close: closeSubCategories } = useOpenState({ defaultOpen: !!slug })
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useOpenState()
  const { data: categories, refetch } = useGetCategoriesQuery({ skip, limit })
  const { data: category } = useGetCategoryQuery(editId!, { enabled: !!editId })
  const { mutate: createCategory } = useAddCategoryMutation()
  const { mutate: updateCategory } = useUpdateCategoryMutation()
  const { mutate: deleteCategory } = useDeleteCategoryMutation()
  const { mutate: deleteCategories } = useDeleteCategoriesMutation()
  const { mutate: uploadCategories } = useUploadCategoriesMutation()
  const { invalidateCategoryQuery } = useInvalidateCategoryQuery()
  const categoriesSelectedRef = useRef<string[]>([])

  const columns: Column<Category>[] = [
    {
      id: 'name',
      name: 'Name'
    },
    {
      id: 'description',
      name: 'Description',
    },
    {
      id: 'subCategory',
      name: 'Sub Categories',
      type: {
        custom: (data) => {
          const subCategories = data?.subCategory
          // return <MUI.Stack direction={'row'} gap={'0.5rem'} flexWrap={'wrap'}>
          //   {subCategories?.map((subCategory) => {
          //     return <Link
          //       key={subCategory.id}
          //       href={`${Routes.SUB_CATEGORIES}/${subCategory.id}`}
          //     >
          //       <CustomChip
          //         variant="outlined"
          //         label={subCategory.name}
          //         clickable
          //         tabIndex={-1}
          //       />
          //     </Link>
          //   })}
          // </MUI.Stack>
          return <MUI.Grid container spacing={2}>
            {subCategories?.map((subCategory) => {
              return <MUI.Grid key={subCategory.id} item xs={2}>
                <Link
                  title={subCategory.name}
                  style={{
                    width: '100%'
                  }}
                  href={`${Routes.SUB_CATEGORIES}/${subCategory.id}`}
                >
                  <CustomChip
                    sx={{
                      width: '100%'
                    }}
                    variant="filled"
                    color="default"
                    label={subCategory.name}
                    clickable
                    tabIndex={-1}
                  />
                </Link>
              </MUI.Grid>
            })}
          </MUI.Grid>
        }
      }
    },
    {
      id: 'actions',
      name: 'Actions',
      type: {
        actions: [
          {
            name: 'Sub Category', variant: 'add', callback: (data) => {
              openSubCategories()
              setEditId(data.id)
            }
          },
          {
            name: 'Edit', variant: 'edit', callback: (data) => {
              open()
              setEditId(data.id)
            }
          },
          {
            name: 'Delete', variant: 'delete', callback: (data) => {
              openDelete()
              setEditId(data.id)
            }
          },
        ]
      }
    }
  ]

  const closeAllModals = () => {
    close()
    closeDelete()
    closeSubCategories()
    setEditId(undefined)
  }

  const onSuccess = () => {
    invalidateCategoryQuery()
    closeAllModals()
    setEditId(undefined)
  }

  const handleDelete = () => {
    if (!editId) {
      return
    }
    if (categoriesSelectedRef.current.length > 0 && categoriesSelectedRef.current.includes(editId)) {
      deleteCategories({ ids: categoriesSelectedRef.current }, {
        onSuccess: () => {
          enqueueSnackbar('Deleted successfully', { variant: 'success' })
          onSuccess()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    } else {
      deleteCategory({ id: editId }, {
        onSuccess: () => {
          enqueueSnackbar('Deleted successfully', { variant: 'success' })
          onSuccess()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    }
  }

  const handleSubmit = (values: CategoryFormType) => {
    const isEdit = !!editId
    if (isEdit) {
      updateCategory({ ...values, id: editId }, {
        onSuccess: () => {
          enqueueSnackbar('Updated successfully', { variant: 'success' })
          onSuccess()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    } else {
      createCategory(values, {
        onSuccess: () => {
          enqueueSnackbar('Created successfully', { variant: 'success' })
          onSuccess()
        },
        onError: (e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      })
    }
  }

  const handleClickImport = () => {
    fileInputRef.current?.click()
  }

  const handleSelectUploadFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      const formData = new FormData();
      formData.append('file', file)
      try {
        // await productClient.post('/category/upload', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })
        // refetch()
        uploadCategories(formData, {
          onSuccess: () => {
            enqueueSnackbar({ message: 'Upload file successfully', variant: 'success' })
            refetch()
          }, onError: (e: Error) => {
            enqueueSnackbar({ message: e.message, variant: 'error' })
          }
        })
        fileInputRef.current!.value = ''
      } catch (e) {
        console.log(e)
      }
    }
  }

  return <>
    <Head>
      <title>Shopifize - Categories</title>
    </Head>
    <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleSelectUploadFiles} />
    <ContentCard>
      <ContentCardHeader>
        <ContentCard.Title>
          Categories
        </ContentCard.Title>
        <MUI.Stack gap={'1rem'} direction={'row'}>
          <CustomButton
            fullWidth={false}
            startIcon={<MUIIcon.Upload />}
            variant="outlined"
            onClick={handleClickImport}
          >
            Import
          </CustomButton>
          <CustomButton
            fullWidth={false}
            startIcon={<MUIIcon.Download />}
            variant="outlined"
          >
            Export
          </CustomButton>
          <CustomButton
            fullWidth={false}
            startIcon={<MUIIcon.Add />}
            onClick={open}
          >
            Category
          </CustomButton>
        </MUI.Stack>
      </ContentCardHeader>
      <ContentCard.Body>
        <CustomTable
          data={categories?.data.data || []}
          columns={columns}
          enableRowSelection
          onRowSelection={(data) => {
            const ids = data.map((category) => category.id)
            categoriesSelectedRef.current = ids
          }}
          pagination={{
            total: categories?.data.total || 0,
            limit: limit,
            skip: skip
          }}
        />
      </ContentCard.Body>
      <CategoryModal
        key={editId}
        open={isOpen}
        values={category?.data}
        isEdit={!!editId}
        handleSubmit={handleSubmit}
        handleClose={closeAllModals}
      />
      <SubCategoriesModal
        categoryId={editId}
        open={isSubCategoryOpen}
        handleClose={closeAllModals}
      />
      <DeleteConfirmationModal
        open={isDeleteOpen}
        title="Are you sure you want to delete this item?"
        handleClose={closeAllModals}
        handleDelete={handleDelete}
      />
    </ContentCard>
  </>
}

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export default CategoryPage
