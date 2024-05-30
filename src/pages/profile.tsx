import FormProfileAbout from '@/components/forms/form-profile-about'
import SettingsPageLayout from '@/components/settings-page-layout'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import useAlert from '@/hooks/useAlert'
import FormJobExperiences from '@/components/forms/form-job-experiences'
import { cn } from '@/lib/utils'
import JobExperienceCard from '@/components/job-experience-card'
import EducationCard from '@/components/education-card'
import FormEducation from '@/components/forms/form-education'
import FormSkills from '@/components/forms/form-skills'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const result = await axios.get(`/account/profile`, {
//     headers: {
//       Authorization: ctx.req.cookies.accessToken,
//     },
//   })

//   return {
//     props: {
//       info: result.data.data,
//     },
//   }
// }

const ProfilePage = () => {
  const router = useRouter()
  const { setAlert, Alert } = useAlert()
  const [jobXpToEdit, setJobXpToEdit] = useState()
  const [showFormJobXp, setShowFormJobXp] = useState(false)

  const [educationToEdit, setEducationToEdit] = useState()
  const [showFormEdu, setShowFormEdu] = useState(false)
  const [editSkills, setEditSkills] = useState(false)
  const [eduLoading, setEduLoading] = useState(false)
  const [expLoading, setExpLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [info, setInfo] = useState<{
    profile: {
      about: string | null
    } | null
    jobExperiences: {
      id: number
      title: string
      companyName: string
      startDate: Date
      endDate: Date | null
      isCurrent: boolean
      userId: number
    }[]
    educations: any
    userSkills: any
  }>()

  function refresh() {
    router.replace(router.asPath)
  }

  async function deleteJobExperience(id: number) {
    try {
      setExpLoading(true)
      if (confirm(`Are you sure want to delete this job experience data?`)) {
        await axios.delete(`/job-experience/${id}`)

        toast.success('Job experience deleted successfully', {
          onAutoClose: (t) => {
            window.location.reload()
          },
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setExpLoading(false)
    }
  }

  async function deleteEducation(id: number) {
    try {
      setEduLoading(true)
      if (confirm(`Are you sure want to delete this education data?`)) {
        await axios.delete(`/education/${id}`)

        toast.success('Education item deleted successfully', {
          onAutoClose: (t) => {
            window.location.reload()
          },
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setEduLoading(false)
    }
  }

  async function getProfile() {
    try {
      setInitialLoading(true)
      const result = await axios.get(`/account/profile`)

      setInfo(result.data.data)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        if (error.status === 401) {
          window.location.href = '/unauthorized'
        }
      }
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <SettingsPageLayout title="Profile | JoFi" headerTitle="Profile">
      <Alert dismissable />

      <div className="mt-4">
        {info && !initialLoading ? (
          <FormProfileAbout
            onSuccess={() => {
              refresh()
            }}
            existingAbout={info?.profile!.about as string}
          />
        ) : initialLoading ? (
          <div className="skeleton max-w-md h-[204px]"></div>
        ) : null}
      </div>

      <div className="divider"></div>

      <div>
        {!initialLoading ? (
          <>
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
              {info && (
                <FormSkills existing={info.userSkills} editMode={editSkills} />
              )}
            </div>
          </>
        ) : (
          <div className="skeleton max-w-md h-[220px]"></div>
        )}
      </div>

      <div className="divider"></div>

      <div>
        {!initialLoading ? (
          <>
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
              {info &&
                info.jobExperiences.map((xp: any) => (
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
                    loading={expLoading}
                  />
                ))}
            </div>

            {showFormJobXp && (
              <FormJobExperiences
                onSuccess={() => {
                  window.location.reload()
                }}
                existing={jobXpToEdit}
              />
            )}
          </>
        ) : (
          <div className="skeleton max-w-md h-[220px]"></div>
        )}
      </div>

      <div className="divider"></div>

      <div>
        {!initialLoading ? (
          <>
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
              {info &&
                info.educations.map((edu: any) => (
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
                    loading={eduLoading}
                  />
                ))}
            </div>

            {showFormEdu && (
              <FormEducation
                onSuccess={() => {
                  window.location.reload()
                }}
                existing={educationToEdit}
              />
            )}
          </>
        ) : (
          <div className="skeleton max-w-md h-[220px]"></div>
        )}
      </div>
    </SettingsPageLayout>
  )
}

export default ProfilePage
