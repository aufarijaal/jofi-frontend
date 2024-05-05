import Link from 'next/link'
import BtnToggleSaveJob from '../btn-toggle-save-job'
import { generateCompanyLogoUrl } from '@/lib/utils'
import convertRupiah from '@/lib/convertRupiah'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'

const JobCard: React.FC<{
  jobData: any
  noCompanyInfo?: boolean
  onSaveToggle?: () => void
  noToggleSaveButton?: boolean
  additonalActions?: React.ReactNode
}> = ({
  jobData,
  noCompanyInfo,
  onSaveToggle,
  noToggleSaveButton,
  additonalActions,
}) => {
  return (
    <Link
      className="job-list-item job-card hover:bg-base-200 transition-colors card w-full lg:max-w-[400px] bg-base-100 shadow-xl"
      href={`/jobs/${jobData.id}`}
    >
      <div className="card-body">
        <div className="flex gap-4 items-center">
          {!noCompanyInfo && (
            <img
              className="w-10 h-10 object-contain"
              src={generateCompanyLogoUrl(jobData.company.logo)}
              alt="company logo"
            />
          )}
          <div>
            <h2 className="card-title">{jobData.title}</h2>
            {!noCompanyInfo && (
              <h4 className="text-sm">{jobData.company.name}</h4>
            )}
          </div>
        </div>

        <div className="my-4">
          <div className="flex items-center gap-2 text-sm">
            <Icon
              icon="mdi:cash"
              width="20"
              height="20"
              className="text-warning"
            />

            <span>{convertRupiah(jobData.salary, { floatingPoint: 0 })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon
              icon="mdi:map"
              width="20"
              height="20"
              className="text-secondary"
            />
            <span>{jobData.location}</span>
          </div>
        </div>

        <div className="card-actions justify-end">
          {!noToggleSaveButton && (
            <BtnToggleSaveJob
              saved={jobData.saved}
              jobId={jobData.id}
              className="btn btn-primary"
              onToggle={() => onSaveToggle?.()}
            />
          )}
          {additonalActions}
        </div>
      </div>
    </Link>
  )
}

export default JobCard
