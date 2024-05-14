import DataManagementLayout from '@/components/data-management-layout'
import DataTable from '@/components/datatable/datatable'
import { JobCategoryWithJobsCount } from '@/types'
import { createColumnHelper } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import DataTableEditAction from '@/components/datatable/datatable-edit-action'
import DataTableDeleteAction from '@/components/datatable/datatable-delete-action'
import DialogAddUpdateJobCategory from '@/components/dialogs/dialog-add-update-job-category'
import { showModal } from '@/lib/utils'

const JobCategoriesManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(() => [])
  const [count, setCount] = useState(0)
  const [dataForUpdate, setDataForUpdate] = useState<{
    id: number
    name: string
  }>()
  const columnHelper = createColumnHelper<JobCategoryWithJobsCount>()
  const dialogId = useMemo(() => 'dialog-add-update-job-category', [])
  const [alert, setAlert] = useState<{
    message: string
    subMessage?: string
    type?: 'info' | 'success' | 'warning' | 'error'
  }>()

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
      footer: 'ID',
      meta: {
        className: 'font-bold',
      },
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      footer: 'Name',
    }),
    columnHelper.accessor('_count.jobs', {
      header: 'Jobs using this category',
      cell: (info) => info.getValue(),
      footer: 'Jobs using this category',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-1">
          <DataTableEditAction
            cellContext={info}
            onClick={() => {
              setDataForUpdate({
                id: info.row.original.id,
                name: info.row.original.name,
              })
              showModal(dialogId)
            }}
          />
          <DataTableDeleteAction
            cellContext={info}
            accessorKey="name"
            onDelete={() => deleteOne(info.row.getValue('id'))}
          />
        </div>
      ),
      footer: 'Actions',
      enableHiding: false,
    }),
  ]

  async function getJobCategories(params?: {
    dataPerPage: number
    q?: string
    page: number
  }) {
    try {
      setLoading(true)
      const result = await axios.get('/job-categories/for-admin', {
        params: {
          dataPerPage: params?.dataPerPage,
          page: params?.page,
          q: params?.q ?? '',
        },
      })

      setData(result.data.data.jobCategories)
      setCount(result.data.data.count)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteOne(id: number) {
    try {
      await axios.delete(`/job-categories/${id}`)

      getJobCategories()
    } catch (error) {
      console.error()
    }
  }

  async function deleteMany(ids: number[]) {
    try {
      if (confirm(`You are about to delete ${ids.length} data. Proceed?`)) {
        await axios.delete(`/job-categories`, {
          data: {
            ids,
          },
        })

        getJobCategories()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getJobCategories()
  }, [])

  return (
    <DataManagementLayout
      headerTitle="Job Categories Management"
      title="Admin Dashboard - Job Categories | JoFi"
    >
      {/* <JsonView data={data}/> */}
      <DialogAddUpdateJobCategory
        onClose={() => setDataForUpdate(undefined)}
        existingData={dataForUpdate}
        dialogId={dialogId}
        onSuccess={() => {
          getJobCategories()
        }}
      />

      <DataTable
        loading={loading}
        alert={alert}
        data={data}
        columns={columns}
        count={count}
        onPaginationChange={(pagination) => {
          getJobCategories({
            dataPerPage: pagination.pageSize,
            page: pagination.pageIndex + 1,
          })
        }}
        onAddBtnClick={() => {
          showModal(dialogId)
        }}
        onDeleteSelectedClick={(table) => {
          deleteMany(
            Object.keys(table.getState().rowSelection).map((id) => parseInt(id))
          )
          table.resetRowSelection()
        }}
        onSearch={(keyword, table) => {
          getJobCategories({
            dataPerPage: table.getState().pagination.pageSize,
            page: table.getState().pagination.pageIndex + 1,
            q: keyword,
          })
        }}
      />
    </DataManagementLayout>
  )
}

export default JobCategoriesManagementPage
