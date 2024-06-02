import { Education } from '@/types'
import dayjs from 'dayjs'

const ApplicantDetailsEduItem: React.FC<{ info: Education }> = ({ info }) => (
  <div className="edu-item p-4 shadow-sm border flex flex-col gap-1">
    <div className="edu-item__institution flex gap-2 items-center">
      <h3 className="font-bold">{info.institution}</h3>
      {info.isCurrent && (
        <div className="badge badge-xs badge-accent py-2">Current</div>
      )}
    </div>

    <div className="edu-item__major">
      <div className="text-xs text-secondary">{info.major}</div>
    </div>

    <div className="edu-item__time mt-1">
      <div className="edu-item__time--start-date text-xs">
        <span className="font-semibold">Start: </span>
        {dayjs(info.startDate).format('MMMM YYYY')}
      </div>
      {info.endDate && (
        <div className="edu-item__time--end-date text-xs">
          <span className="font-semibold">End: </span>
          {dayjs(info.endDate).format('MMMM YYYY')}
        </div>
      )}
    </div>
  </div>
)

export default ApplicantDetailsEduItem
