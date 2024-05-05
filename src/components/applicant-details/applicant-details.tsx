import { generatePhotoProfileUrl } from '@/lib/utils'
import { ApplicantDetails } from '@/types'
import { Icon } from '@iconify-icon/react'
import React from 'react'
import ApplicantDetailsSkillItem from './applicant-details-skill-item'
import ApplicantDetailsJobExperienceItem from './applicant-details-job-experience-item'
import ApplicantDetailsEduItem from './applicant-details-edu-item'

const ApplicantDetailsWrapper: React.FC<{
  applicantDetails?: ApplicantDetails
}> = ({ applicantDetails }) => {
  return (
    <div id="applicant-details" className="flex flex-col items-center">
      <div id="applicant-details__photo">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={generatePhotoProfileUrl(
            applicantDetails?.profile.photo ?? 'not-found.jpg'
          )}
          alt="photo profile"
        />
      </div>

      <div
        id="applicant-details__name"
        className="mt-6 flex items-center flex-col"
      >
        <p className="uppercase font-bold text-lg">
          {applicantDetails?.profile.name}
        </p>
        <span className="text-xs">{applicantDetails?.email}</span>

        <button
          id="applicant-details__resume"
          className="mt-6 flex items-center gap-2 btn btn-accent btn-outline"
          disabled
        >
          <Icon icon="mdi:file-document" width="24" height="24" />
          Download resume
        </button>
      </div>

      <div id="applicant-details__about" className="w-full px-4 mt-6">
        <h4 className="text-secondary text-lg">About</h4>
        <p className="text-sm">
          {applicantDetails?.profile.about ??
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque numquam architecto fuga facere quae exercitationem molestiae in nemo eos modi asperiores mollitia maiores debitis, illum aut eligendi sit, recusandae dicta.'}
        </p>
      </div>

      <div id="applicant-details__skills" className="w-full px-4 mt-6">
        <h4 className="text-secondary text-lg">Skills</h4>
        <div className="skill-list flex gap-4 flex-wrap mt-2">
          {applicantDetails?.userSkills.map((userSkill) => (
            <ApplicantDetailsSkillItem skillName={userSkill.skill.name} />
          ))}
        </div>
      </div>

      <div id="applicant-details__job-experiences" className="w-full px-4 mt-6">
        <h4 className="text-secondary text-lg">Previous Experience</h4>
        <div className="job-experiences-list mt-2 flex flex-col gap-2">
          {applicantDetails?.jobExperiences.map((xp) => (
            <ApplicantDetailsJobExperienceItem info={xp} />
          ))}
        </div>
      </div>

      <div id="applicant-details__educations" className="w-full px-4 mt-6">
        <h4 className="text-secondary text-lg">Educations</h4>
        <div className="edu-list mt-2">
          {applicantDetails?.educations.map((edu) => (
            <ApplicantDetailsEduItem info={edu} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApplicantDetailsWrapper
