import Head from 'next/head'
import React, { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import DialogAddUser from '@/components/dialogs/dialog-add-user'
import DataTable from '@/components/datatable/datatable'
import { AxiosError } from 'axios'
import { Icon } from '@iconify-icon/react'
import { createColumnHelper } from '@tanstack/react-table'
import { UserWithName } from '@/types'
import DataTableDeleteAction from '@/components/datatable/datatable-delete-action'
import DataTableEditAction from '@/components/datatable/datatable-edit-action'
import DialogEditUser from '@/components/dialogs/dialog-edit-user'
import DataManagementLayout from '@/components/data-management-layout'
import { showModal } from '@/lib/utils'
import DialogResetUserPassword from '@/components/dialogs/dialog-reset-user-password'

function UsersManagementPage() {
  const [loading, setLoading] = useState(true)
  const [wide, setWide] = useState(false)
  const [data, setData] = useState(() => [])
  const [count, setCount] = useState(0)
  const dialogAddUserId = useMemo(() => 'dialog-add-user', [])
  const dialogEditUserId = useMemo(() => 'dialog-edit-user', [])
  const dialogResetUserPasswordId = useMemo(
    () => 'dialog-reset-user-password',
    []
  )
  const [existingData, setExistingData] = useState<{
    id: number
    name: string
    email: string
    companyId: number | null
    isEmployer: boolean
  }>()
  const [userIdToUpdate, setUserIdToUpdate] = useState(0)

  const [alert, setAlert] = useState<{
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
  }>({
    message: '',
    type: 'info',
  })

  const columnHelper = createColumnHelper<UserWithName>()

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
      footer: 'ID',
      meta: {
        className: 'font-bold',
      },
    }),
    columnHelper.accessor('profile.name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      footer: 'Name',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
      footer: 'Email',
    }),
    columnHelper.accessor('isEmployer', {
      header: 'Is employer',
      cell: (info) => info.getValue(),
      footer: 'Is employer',
    }),
    columnHelper.accessor('employerVerified', {
      header: 'Verified employer',
      cell: (info) => info.getValue(),
      footer: 'Verified employer',
    }),
    columnHelper.accessor('company.name', {
      header: 'Company',
      cell: (info) => info.getValue(),
      footer: 'Company',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-1">
          <div className="tooltip tooltip-left" data-tip="Reset password">
            <button
              className="btn btn-xs btn-warning btn-outline"
              onClick={(e) => {
                e.stopPropagation()
                setUserIdToUpdate(info.row.original.id)
                showModal(dialogResetUserPasswordId)
              }}
            >
              <Icon icon="mdi:form-textbox-password" width="16" height="16" />
            </button>
          </div>
          <DataTableEditAction
            cellContext={info}
            onClick={() => {
              setExistingData({
                id: info.row.original.id,
                name: info.row.original.profile?.name!,
                companyId: info.row.original.companyId ?? null,
                email: info.row.original.email,
                isEmployer: info.row.original.isEmployer,
              })
              showModal(dialogEditUserId)
            }}
          />
          <DataTableDeleteAction
            cellContext={info}
            accessorKey="email"
            onDelete={() => deleteUser(info.row.getValue('id'))}
          />
        </div>
      ),
      footer: 'Actions',
      enableHiding: false,
    }),
  ]

  async function deleteUser(id: number) {
    try {
      await axios.delete(`/users/${id}`)

      setAlert({
        message: 'User deleted successfully',
        type: 'info',
      })
      getUsers()
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      }
    }
  }

  async function getUsers(params?: {
    dataPerPage: number
    q?: string
    page: number
  }) {
    try {
      setLoading(true)
      const result = await axios.get('/users/for-admin', {
        params: {
          dataPerPage: params?.dataPerPage,
          page: params?.page,
          q: params?.q ?? '',
        },
      })

      setData(result.data.data.users)
      setCount(result.data.data.count)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <DataManagementLayout
      headerTitle="👥 Users Management"
      title="Admin Dashboard - Users | JoFi"
    >
      {/* Dialogs */}
      <DialogAddUser dialogId={dialogAddUserId} onSuccess={() => getUsers()} />

      <DialogEditUser
        dialogId={dialogEditUserId}
        onSuccess={() => {
          getUsers()
        }}
        onClose={() => {
          setExistingData(undefined)
        }}
        existingData={existingData}
      />

      <DialogResetUserPassword
        dialogId={dialogResetUserPasswordId}
        onSuccess={() => getUsers()}
        userId={userIdToUpdate}
      />

      <DataTable
        data={data}
        columns={columns}
        count={count}
        onPaginationChange={(pagination) => {
          getUsers({
            dataPerPage: pagination.pageSize,
            page: pagination.pageIndex + 1,
          })
        }}
        onAddBtnClick={() => {
          showModal(dialogAddUserId)
        }}
        noDeleteMany
        onSearch={(keyword, table) => {
          getUsers({
            dataPerPage: table.getState().pagination.pageSize,
            page: table.getState().pagination.pageIndex + 1,
            q: keyword,
          })
        }}
      />
    </DataManagementLayout>
  )
}

export default UsersManagementPage
