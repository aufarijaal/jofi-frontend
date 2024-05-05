import { generateCompanyLogoUrl, showModal } from '@/lib/utils'
import { Company, FilterParams } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import DataTable from '@/components/datatable/datatable'
import DataTableEditAction from '@/components/datatable/datatable-edit-action'
import DataTableDeleteAction from '@/components/datatable/datatable-delete-action'
import DialogAddCompany from '@/components/dialogs/dialog-add-company'
import FormUploadCompanyLogo from '@/components/form-upload-company-logo'
import DialogEditCompany from '@/components/dialogs/dialog-edit-company'
import DataManagementLayout from '@/components/data-management-layout'
import { toast } from 'react-toastify'
import useDialog from '@/hooks/useDialog'
import * as company from '@/services/company-service'

function CompaniesManagementPage() {
  const [data, setData] = useState<Company[] | undefined>([])
  const [count, setCount] = useState<number>()
  const AddCompanyDialog = useDialog()
  const EditCompanyDialog = useDialog()
  const columnHelper = createColumnHelper<Company>()
  const [existingData, setExistingData] = useState<Company>()
  const dialogAddCompanyId = useMemo(() => 'dialog-add-company', [])
  const dialogEditCompanyId = useMemo(() => 'dialog-edit-company', [])

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
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
      footer: 'Location',
    }),
    columnHelper.accessor('about', {
      header: 'About',
      cell: (info) => info.getValue(),
      footer: 'About',
      meta: {
        className: 'text-ellipsis overflow-hidden max-w-xs whitespace-nowrap',
      },
    }),
    columnHelper.accessor('industry', {
      header: 'Industry',
      cell: (info) => info.getValue(),
      footer: 'Industry',
    }),
    columnHelper.accessor('logo', {
      header: 'Logo',
      cell: (info) => (
        <img
          className="w-5 h-5 object-contain"
          src={generateCompanyLogoUrl(info.getValue())}
          alt="company logo"
        />
      ),
      footer: 'Logo',
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: (info) => info.getValue(),
      footer: 'Slug',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-1">
          <FormUploadCompanyLogo
            id={parseInt(info.row.id)}
            onSuccess={() => {
              console.log('Company image uploaded successfully uploaded', {
                type: 'success',
              })
              getCompanies()
            }}
            onError={(error) => console.log(error.message)}
            title="Change image"
          />
          <DataTableEditAction
            cellContext={info}
            onClick={() => {
              setExistingData(info.row.original)
              showModal(dialogEditCompanyId)
            }}
          />
          <DataTableDeleteAction
            cellContext={info}
            accessorKey="name"
            onDelete={() => deleteCompany(info.row.getValue('id'))}
          />
        </div>
      ),
      footer: 'Actions',
      enableHiding: false,
    }),
  ]

  async function deleteCompany(id: number) {
    try {
      await company.deleteOne(id)

      console.log('Company deleted successfully')
      getCompanies()
    } catch (error: any) {
      console.log(error.message)
    }
  }

  async function deleteManyCompany(ids: number[]) {
    try {
      company.deleteMany(ids)

      console.log('Company deleted successfully')
      getCompanies()
    } catch (error: any) {
      console.log(error.message)
    }
  }

  async function getCompanies(params?: FilterParams) {
    try {
      const result = await company.get(params)

      setData(result?.companies)
      setCount(result?.count)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [])

  return (
    <DataManagementLayout
      headerTitle="🏢 Companies Management"
      title="Admin Dashboard - Companies | JoFi"
    >
      {/* Dialogs */}
      <DialogAddCompany
        dialogId={dialogAddCompanyId}
        onSuccess={() => {
          getCompanies()
        }}
      />

      <DialogEditCompany
        dialogId={dialogEditCompanyId}
        onSuccess={() => {
          getCompanies()
        }}
        onClose={() => {
          setExistingData(undefined)
        }}
        existingData={existingData}
      />

      {/* Data table */}
      <DataTable
        data={data}
        columns={columns}
        count={count ?? 0}
        onPaginationChange={(pagination) => {
          getCompanies({
            pageSize: pagination.pageSize,
            pageIndex: pagination.pageIndex + 1,
          })
        }}
        defaultColumnsVisibility={{
          slug: false,
        }}
        onAddBtnClick={() => {
          showModal(dialogAddCompanyId)
        }}
        onDeleteSelectedClick={(table: Table<Company>) => {
          const selectedIds = Object.keys(table.getState().rowSelection).map(
            (key) => parseInt(key)
          )
          if (
            confirm(
              `You are about to delete ${selectedIds.length} data, proceed?`
            )
          ) {
            deleteManyCompany(selectedIds)
            table.resetRowSelection()
          }
        }}
        onSearch={(keyword, table) => {
          getCompanies({
            pageSize: table.getState().pagination.pageSize,
            pageIndex: table.getState().pagination.pageIndex + 1,
            q: keyword,
          })
        }}
        searchPlaceholderText="Search by company name, industry..."
      />
    </DataManagementLayout>
  )
}

export default CompaniesManagementPage
