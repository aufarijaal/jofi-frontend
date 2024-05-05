import DataManagementLayout from '@/components/data-management-layout'
import { ApplicantDetails, FilterParams } from '@/types'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '@/lib/axios'
import DataTable from '@/components/datatable/datatable'
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from '@tanstack/react-table'
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import useDialog from '@/hooks/useDialog'
import * as changeCase from 'change-case'
import { AxiosError } from 'axios'
import { generatePhotoProfileUrl } from '@/lib/utils'
import ApplicantDetailsWrapper from '@/components/applicant-details/applicant-details'

type ApplicationStatus =
  | 'UNDER_REVIEW'
  | 'RECEIVED'
  | 'INTERVIEW'
  | 'APPROVED'
  | 'REJECTED'

interface Application {
  id: number
  jobId: number
  userId: number
  status: ApplicationStatus
  createdAt: string
  job: {
    title: string
  }
  user: {
    profile: {
      name: string
    }
  }
}

const ApplicationStatusBadge: React.FC<{
  status: ApplicationStatus
  onSelect: (value: ApplicationStatus) => void
}> = ({ status, onSelect }) => {
  const applicationStatuses = useMemo<ApplicationStatus[]>(
    () => ['APPROVED', 'INTERVIEW', 'RECEIVED', 'REJECTED', 'UNDER_REVIEW'],
    []
  )

  const ApplicationStatusMenuButton: React.FC<{
    status: ApplicationStatus
    onClick: (e: any) => void
  }> = ({ status, onClick }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick(e)
        }}
      >
        {changeCase.capitalCase(status)}
      </button>
    )
  }

  function makeVariants(value: any) {
    switch (value) {
      case 'APPROVED':
        return 'bg-success'
      case 'INTERVIEW':
        return 'bg-info'
      case 'RECEIVED':
        return 'bg-neutral'
      case 'REJECTED':
        return 'bg-error'
      case 'UNDER_REVIEW':
        return 'bg-warning'
      default:
        break
    }
  }

  return (
    <div className="dropdown dropdown-hover dropdown-right">
      <div
        tabIndex={0}
        role="button"
        className="flex gap-2 items-center font-bold"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className={`w-3 h-3 rounded-full ${makeVariants(status)}`}></div>
        {changeCase.capitalCase(status)}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu menu-xs p-2 shadow bg-base-100 rounded-box w-max -translate-y-10"
      >
        <h4></h4>
        {applicationStatuses.map((status, i) => (
          <li key={i}>
            <ApplicationStatusMenuButton
              status={status}
              onClick={() => {
                onSelect(status)
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

const EmployerManageApplicationsPage = () => {
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails>()
  const ApplicantDetailsDialog = useDialog()

  const columnHelper = createColumnHelper<Application>()

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
      footer: 'ID',
      meta: {
        className: 'font-bold',
      },
    }),
    columnHelper.accessor('user.profile.name', {
      header: 'Name',
      cell: (info) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            getApplicantDetails(info.row.original.userId)
          }}
        >
          {info.getValue()}
          <button className="bg-accent rounded-full w-4 h-4 text-accent-content">
            <Icon icon="mdi:information-symbol" width="16" height="16" />
          </button>
        </div>
      ),
    }),
    columnHelper.accessor('job.title', {
      header: 'Designation',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <ApplicationStatusBadge
          key={info.row.original.id}
          status={info.getValue()}
          onSelect={(value) => updateApplicantStatus(value, info)}
        />
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Applied at',
      cell: (info) => new Date(info.getValue()).toDateString(),
    }),
  ]

  async function updateApplicantStatus(
    status: ApplicationStatus,
    cellContext: CellContext<Application, ApplicationStatus>
  ) {
    try {
      if (
        confirm(
          `Are you sure want to update status ${
            cellContext.row.original.user.profile.name
          } - ${cellContext.row.original.job.title} to ${changeCase.capitalCase(
            status
          )}?`
        )
      ) {
        await axios.put(
          `/applications/${cellContext.row.original.id}/update-status`,
          {
            status,
          }
        )

        getApplications()
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function getApplications(params?: FilterParams) {
    try {
      const result = await axios.get(`/companies/applications`, {
        params: {
          dataPerPage: params?.pageSize,
          page: params?.pageIndex,
          q: params?.q,
        },
      })

      setData(result.data.data.applications)
      setCount(result.data.data.count)
    } catch (error: any) {
      console.error(error)

      console.log(error.message)
    }
  }

  async function getApplicantDetails(applicantId: number) {
    try {
      const result = await axios.get(
        `/applications/${applicantId}/applicant-details`
      )

      setApplicantDetails(result.data.data)
    } catch (error: any) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    if (applicantDetails) {
      ApplicantDetailsDialog.show()
    }
  }, [applicantDetails])

  return (
    <DataManagementLayout
      headerTitle="Job Applications Management"
      title="Employer Dashboard - Job Applications Management | JoFi"
    >
      {/* <JsonView data={data} style={defaultStyles} /> */}

      <ApplicantDetailsDialog.Dialog
        title="Applicant Details"
        dialogId="applicant-details-dialog"
        modalBoxClassName="w-[calc(100vw-100px)] max-w-7xl"
        onClose={() => setApplicantDetails(undefined)}
      >
        <ApplicantDetailsWrapper applicantDetails={applicantDetails} />
      </ApplicantDetailsDialog.Dialog>

      <DataTable
        columns={columns}
        data={data}
        count={count}
        onPaginationChange={(pagination) => {
          getApplications({
            pageIndex: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          })
        }}
        onSearch={(keyword, table) => {
          getApplications({
            pageIndex: table.getState().pagination.pageIndex + 1,
            pageSize: table.getState().pagination.pageSize,
            q: keyword,
          })
        }}
        noAdd
        noSelection
        noDeleteMany
      />
    </DataManagementLayout>
  )
}

export default EmployerManageApplicationsPage
