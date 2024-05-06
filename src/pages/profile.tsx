import FormProfileAbout from '@/components/forms/form-profile-about'
import SettingsPageLayout from '@/components/settings-page-layout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { JsonView } from 'react-json-view-lite'
import { toast } from 'react-toastify'
import useAlert from '@/hooks/useAlert'
import FormJobExperiences from '@/components/forms/form-job-experiences'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import JobExperienceCard from '@/components/job-experience-card'
import EducationCard from '@/components/education-card'
import FormEducation from '@/components/forms/form-education'
import FormSkills from '@/components/forms/form-skills'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await axios.get(`/account/profile`, {
    headers: {
      Authorization: ctx.req.cookies.accessToken,
    },
  })

  return {
    props: {
      info: result.data.data,
    },
  }
}

const ProfilePage = ({ info }: any) => {
  const router = useRouter()
  const { setAlert, Alert } = useAlert()
  const [jobXpToEdit, setJobXpToEdit] = useState()
  const [showFormJobXp, setShowFormJobXp] = useState(false)

  const [educationToEdit, setEducationToEdit] = useState()
  const [showFormEdu, setShowFormEdu] = useState(false)
  const [editSkills, setEditSkills] = useState(false)

  function refresh() {
    router.replace(router.asPath)
  }

  async function deleteJobExperience(id: number) {
    try {
      if (confirm(`Are you sure want to delete this job experience data?`)) {
        await axios.delete(`/job-experience/${id}`)

        refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteEducation(id: number) {
    try {
      if (confirm(`Are you sure want to delete this education data?`)) {
        await axios.delete(`/education/${id}`)

        refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SettingsPageLayout title="Profile | JoFi" headerTitle="Profile">
      <Alert dismissable />

      <div className="mt-4">
        <FormProfileAbout
          onSuccess={() => {
            refresh()
            setAlert({
              message: 'About updated successfully',
              type: 'success',
            })
          }}
          existingAbout={info.profile.about}
        />
      </div>

      <div className="divider"></div>

      <div>
        <div className="flex items-center justify-between max-w-md">
          <h4 className="text-lg font-semibold">Skills</h4>
          <button
            className={cn([
              'btn btn-xs',
              editSkills ? 'btn-warning' : 'btn-accent',
            ])}
            onClick={() => setEditSkills(!editSkills)}
          >
            {editSkills ? 'OK' : 'Edit'}
          </button>
        </div>

        <div className="mt-2">
          <FormSkills
            existing={info.userSkills}
            editMode={editSkills}
          />
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="flex items-center justify-between max-w-md">
          <h4 className="text-lg font-semibold">Job Experiences</h4>
          <button
            className={cn([
              'btn btn-xs',
              showFormJobXp ? 'btn-warning' : 'btn-accent',
            ])}
            onClick={() => {
              setShowFormJobXp(!showFormJobXp)

              if (!showFormJobXp) setJobXpToEdit(undefined)
            }}
          >
            {showFormJobXp ? 'Cancel' : 'Add new'}
          </button>
        </div>

        <div
          className={cn([
            'job-experience-list flex-col gap-2 mt-4',
            showFormJobXp ? 'hidden' : 'flex',
          ])}
        >
          {info.jobExperiences.map((xp: any) => (
            <JobExperienceCard
              data={xp}
              key={xp.id}
              onEditClick={() => {
                setJobXpToEdit(xp)
                setShowFormJobXp(true)
              }}
              onDeleteClick={() => {
                deleteJobExperience(xp.id)
              }}
            />
          ))}
        </div>

        {showFormJobXp && (
          <FormJobExperiences
            onSuccess={() => {
              refresh()
              setAlert({
                message: 'Job experience updated',
                type: 'success',
              })
              setShowFormJobXp(false)
              setJobXpToEdit(undefined)
            }}
            existing={jobXpToEdit}
          />
        )}
      </div>

      <div className="divider"></div>

      <div>
        <div className="flex items-center justify-between max-w-md">
          <h4 className="text-lg font-semibold">Educations</h4>
          <button
            className={cn([
              'btn btn-xs',
              showFormEdu ? 'btn-warning' : 'btn-accent',
            ])}
            onClick={() => {
              setShowFormEdu(!showFormEdu)

              if (!showFormEdu) setEducationToEdit(undefined)
            }}
          >
            {showFormEdu ? 'Cancel' : 'Add new'}
          </button>
        </div>

        <div
          className={cn([
            'education-list flex-col gap-2 mt-4',
            showFormEdu ? 'hidden' : 'flex',
          ])}
        >
          {info.educations.map((edu: any) => (
            <EducationCard
              data={edu}
              key={edu.id}
              onEditClick={() => {
                setEducationToEdit(edu)
                setShowFormEdu(true)
              }}
              onDeleteClick={() => {
                deleteEducation(edu.id)
              }}
            />
          ))}
        </div>

        {showFormEdu && (
          <FormEducation
            onSuccess={() => {
              refresh()
              setAlert({
                message: 'Education updated',
                type: 'success',
              })
              setShowFormEdu(false)
              setEducationToEdit(undefined)
            }}
            existing={educationToEdit}
          />
        )}
      </div>
    </SettingsPageLayout>
  )
}

export default ProfilePage