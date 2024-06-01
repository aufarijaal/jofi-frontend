import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import React from 'react'

interface Props {
  info: {
    jobPostId: number
    title: string
    salary: string
    location: string
    postedAt: string
    applicantCount: number
  }
  onDeleteBtnClick: (id: number) => void
  onEditBtnClick: () => void
}

const EmployerJobCard: React.FC<Props> = ({
  info,
  onDeleteBtnClick,
  onEditBtnClick,
}) => {
  return (
    <div
      className="job-list-item job-card card w-full bg-base-100 shadow-xl"
      key={info.jobPostId}
    >
      <div className="card-body">
        <div className="flex gap-4 items-center">
          <div>
            <h2 className="card-title">{info.title}</h2>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            {/* <Icon icon="mdi:cash" width="20" height="20" /> */}
            <span className="text-[16px]">💵</span>
            <span>{info.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {/* <Icon icon="mdi:map-marker-outline" width="20" height="20" /> */}
            <span className="text-[16px]">🗺️</span>
            <span>{info.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {/* <Icon icon="mdi:clock-time-five-outline" width="20" height="20" /> */}
            <span className="text-[16px]">📅</span>
            <span>{info.postedAt}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {/* <Icon icon="mdi:account-outline" width="20" height="20" /> */}
            <span className="text-[16px]">🕵️</span>
            <span>{info.applicantCount} applicants</span>
          </div>
        </div>

        <div className="card-actions justify-end">
          <div className="join">
            <div className="tooltip" data-tip="Edit this">
              <button
                className="join-item btn btn-success btn-sm text-white"
                onClick={() => onEditBtnClick()}
              >
                <Icon icon="mdi:pencil" width="20" height="20" />
              </button>
            </div>

            <div className="tooltip" data-tip="Remove">
              <button
                className="join-item btn btn-error btn-sm text-white"
                onClick={() => onDeleteBtnClick(info.jobPostId)}
              >
                <Icon icon="mdi:trash-can" width="20" height="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerJobCard
