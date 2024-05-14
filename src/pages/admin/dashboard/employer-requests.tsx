import DataTable from '@/components/datatable/datatable'
import DataTableDeleteAction from '@/components/datatable/datatable-delete-action'
import { generateCompanyLogoUrl } from '@/lib/utils'
import { Company, EmployerRequest } from '@/types'
import { Icon } from '@iconify-icon/react'
import { createColumnHelper } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import axios from '@/lib/axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import FormAcceptEmployerRequests from '@/components/form-accept-employer-requests'
import DataManagementLayout from '@/components/data-management-layout'

function EmployerRequestsPage() {
  const [loading, setLoading] = useState(true)
  const [wide, setWide] = useState(false)
  const [data, setData] = useState(() => [])
  const [count, setCount] = useState(0)
  const [alert, setAlert] = useState<{
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
  }>({
    message: '',
    type: 'info',
  })

  const columnHelper = createColumnHelper<EmployerRequest>()

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
          <FormAcceptEmployerRequests
            id={parseInt(info.row.getValue('id'))}
            email={info.row.getValue('email')}
            onSuccess={() =>
              getEmployerRequests({
                dataPerPage: info.table.getState().pagination.pageSize,
                page: info.table.getState().pagination.pageIndex + 1,
                q: '',
              })
            }
          />
        </div>
      ),
      footer: 'Actions',
      enableHiding: false,
    }),
  ]

  async function getEmployerRequests(params?: {
    dataPerPage: number
    q?: string
    page: number
  }) {
    try {
      setLoading(true)
      const result = await axios.get('/employers/verification-requests', {
        params: {
          dataPerPage: params?.dataPerPage,
          page: params?.page,
          q: params?.q ?? '',
        },
      })

      setData(result.data.data.employers)
      setCount(result.data.data.count)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function acceptAll() {
    try {
      if (
        confirm('Are you sure want to accept all of the employer requests?')
      ) {
        await axios.put(`/employers/verification-requests/accept-all`)

        getEmployerRequests()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getEmployerRequests()
  }, [])

  return (
    <DataManagementLayout
      headerTitle="Employer Requests"
      title="Admin Dashboard - Employer requests | JoFi"
    >
      <DataTable
        loading={loading}
        alert={alert}
        noSelection
        data={data}
        columns={columns}
        count={count}
        onPaginationChange={(pagination) => {
          getEmployerRequests({
            dataPerPage: pagination.pageSize,
            page: pagination.pageIndex + 1,
          })
        }}
        defaultColumnsVisibility={{
          slug: false,
        }}
        noAdd
        additionalToolbarButtons={(table) => {
          return (
            <>
              {data.length > 0 ? (
                <button
                  className="btn btn-xs btn-accent"
                  onClick={() => acceptAll()}
                >
                  Accept all
                </button>
              ) : null}
            </>
          )
        }}
        onSearch={(keyword, table) => {
          getEmployerRequests({
            dataPerPage: table.getState().pagination.pageSize,
            page: table.getState().pagination.pageIndex + 1,
            q: keyword,
          })
        }}
      />
    </DataManagementLayout>
  )
}

export default EmployerRequestsPage
