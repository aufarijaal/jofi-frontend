import { JobExperience } from '@/types'
import dayjs from 'dayjs'

const ApplicantDetailsJobExperienceItem: React.FC<{ info: JobExperience }> = ({
  info,
}) => (
  <div className="job-experience-item p-4 shadow-sm border flex flex-col gap-1">
    <div className="job-experience-item__title flex gap-2 items-center">
      <h3 className="font-bold">{info.title}</h3>
      {info.isCurrent && (
        <div className="badge badge-xs badge-accent py-2">Current</div>
      )}
    </div>

    <div className="job-experience-item__company">
      <div className="text-xs text-secondary">{info.companyName}</div>
    </div>

    <div className="job-experience-item__time mt-1">
      <div className="job-experience-item__time--start-date text-xs">
        <span className="font-semibold">Start: </span>
        {dayjs(info.startDate).format('MMMM YYYY')}
      </div>
      <div className="job-experience-item__time--end-date text-xs">
        <span className="font-semibold">End: </span>
        {dayjs(info.endDate).format('MMMM YYYY') ?? '-'}
      </div>
    </div>
  </div>
)

export default ApplicantDetailsJobExperienceItem
