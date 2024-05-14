import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  data: {
    id: number
    level: string
    institution: string
    major: string
    startDate: string
    endDate?: string
    isCurrent: boolean
  }
  onDeleteClick?: (id: number) => void
  onEditClick?: (id: number) => void
  loading?: boolean
}

const EducationCard: React.FC<Props> = ({
  data,
  onDeleteClick,
  onEditClick,
  loading,
}) => {
  return (
    <div className="education-item-wrapper flex max-w-md min-w-[400px] gap-2">
      <div
        className="education-item card shadow-lg p-4 relative w-full"
        key={data.id}
      >
        {data.isCurrent && (
          <div className="w-max h-max py-1 px-2.5 text-xs font-semibold bg-primary text-white rounded-sm absolute top-4 right-4">
            Current
          </div>
        )}
        <h3 className="font-semibold">{data.major}</h3>
        <h5 className="text-secondary text-xs">at {data.institution}</h5>
        <h5 className="text-secondary text-xs">{data.level}</h5>

        <div className="flex flex-col gap-1 mt-2">
          <h5 className="text-secondary text-xs font-semibold">
            Start: {dayjs(data.startDate).format('MMM YYYY')}
          </h5>
          {data.endDate && !data.isCurrent ? (
            <h5 className="text-secondary text-xs font-semibold">
              End: {dayjs(data.endDate).format('MMM YYYY')}
            </h5>
          ) : null}
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2">
        <button
          className="btn btn-success h-full"
          onClick={() => onEditClick?.(data.id)}
          disabled={loading}
        >
          <Icon icon="mdi:pencil" />
        </button>
        <button
          className="btn btn-error h-full"
          onClick={() => onDeleteClick?.(data.id)}
          disabled={loading}
        >
          <Icon icon="mdi:trash-can" />
        </button>
      </div>
    </div>
  )
}

export default EducationCard
