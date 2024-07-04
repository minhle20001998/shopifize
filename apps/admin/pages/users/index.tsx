/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useMemo, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { DashboardLayout, Protected } from "~/components/layouts";
import Head from "next/head";
import { ContentCard } from "~/components/common";
import { Column, CustomButton, CustomChip, CustomTable, MUI, MUIIcon, useOpenState, usePaginationQuery } from "@shopifize/ui";
import { useGetUsersQuery, useUpdateRoleMutation } from "~/queries/users";
import { User, UserRole } from "@shopifize/helpers";
import { UserEditModal } from "~/components/pages";
import { useSnackbar } from "notistack";

const UsersPage: NextPageWithLayout = () => {
  const { limit, skip } = usePaginationQuery()
  const { data: users, refetch: refetchUsers } = useGetUsersQuery({skip, limit})
  const { isOpen, open, close } = useOpenState()
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const {enqueueSnackbar} = useSnackbar()
  const updateRole = useUpdateRoleMutation()

  const handleSubmit = (values: {
    roles: (string | undefined)[];
  }) => {
    if (values.roles && userId) {
      updateRole.mutate({ roles: values.roles as UserRole[], userId }, {
        onSuccess: () => {
          setUserId(undefined)
          enqueueSnackbar("Update role successfully", {variant: 'success'})
          close()
          refetchUsers()
        },
        onError: () => {
          enqueueSnackbar("Fail to update role", {variant: 'error'})
        }
      })
    }
  }

  const columns: Column<User>[] = useMemo<Column<User>[]>(() => {
    return [
      { id: 'email', name: 'Email' },
      {
        id: 'roles', name: 'Roles', type: {
          custom: (data) => {
            return data?.roles?.map((role) => {
              return <CustomChip sx={{ marginRight: '0.5rem' }} key={role.id} label={role.role} />
            })
          }
        }
      },
      {
        id: 'actions',
        name: 'Actions',
        type: {
          actions: [
            {
              variant: 'edit', name: 'Edit', callback: (data) => {
                setUserId(data.id)
                open()
              }
            },
            { variant: 'delete', name: 'Delete' },
          ]
        }
      }
    ]
  }, [])

  return <>
    <Head>
      <title>Shopifize - Users</title>
    </Head>
    {/* TABLE */}
    <ContentCard>
      <ContentCard.Header>
        <ContentCard.Title>
          Users
        </ContentCard.Title>
        <MUI.Stack direction={'row'} gap={'1rem'}>
          <CustomButton
            variant="text"
            color="success"
            startIcon={<MUIIcon.FilterAlt />}
          >
            Filter
          </CustomButton>
        </MUI.Stack>
      </ContentCard.Header>
      <ContentCard.Body>
        <CustomTable
          data={users?.data.data || []}
          columns={columns}
          pagination={{
            total: users?.data.total || 0,
            limit: limit,
            skip: skip
          }}
        />
      </ContentCard.Body>
    </ContentCard>
    <UserEditModal key={String(isOpen)} userId={userId} open={isOpen} handleClose={close} handleSubmit={handleSubmit} />
  </>
}

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export default UsersPage;