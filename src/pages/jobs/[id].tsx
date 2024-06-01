import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Head from 'next/head'
import { generateCompanyLogoUrl } from '@/lib/utils'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import convertRupiah from '@/lib/convertRupiah'
import BtnToggleSaveJob from '@/components/btn-toggle-save-job'
import JobCard from '@/components/job-card/job-card'
import { AxiosError } from 'axios'
import { JsonView } from 'react-json-view-lite'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/context/AuthContext'
import { redirect, useParams } from 'next/navigation'

interface Job {
  detail: Detail
  relatedJobs: JobInfo[]
  moreFromCompany: JobInfo[]
}
interface JobInfo {
  id: number
  employerId: number
  companyId: number
  jobCategoryId: number
  title: string
  description: string
  requirements: string
  salary: string
  location: string
  createdAt: string
  updatedAt?: any
  deletedAt?: any
  company: Company
  active?: boolean
}
interface Detail {
  id: number
  employerId: number
  companyId: number
  jobCategoryId: number
  title: string
  description: string
  requirements: string
  salary: string
  location: string
  createdAt: string
  updatedAt?: any
  deletedAt?: any
  category: Category
  company: Company
  saved: boolean
  applied: boolean
  active?: boolean
}
interface Company {
  name: string
  logo: string
  slug: string
}
interface Category {
  name: string
  slug: string
}

// export const getServerSideProps = (async (ctx) => {
//   try {
//     const job = await axios.get(`/jobs/${ctx.params?.id}`, {
//       headers: {
//         Authorization: ctx.req.cookies.accessToken,
//       },
//     })

//     return {
//       props: {
//         job: job?.data.data,
//       },
//     }
//   } catch (error) {
//     if (error instanceof AxiosError && error.status === 404) {
//       return {
//         notFound: true,
//         props: {
//           job: {},
//         },
//       }
//     }

//     return {
//       props: {
//         job: {},
//       },
//     }
//   }
// }) satisfies GetServerSideProps<{ job: JobProps }>

const JobDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const auth = useAuthContext()
  const [job, setJob] = useState<Job>()
  const [loading, setLoading] = useState(true)
  const [loadingApplyingJob, setLoadinApplyingJob] = useState(false)

  async function applyJob() {
    try {
      setLoadinApplyingJob(true)
      if (!auth?.user) {
        return router.push('/auth/signin')
      }

      await axios.post(`/jobs/${job?.detail.id}/apply`)

      router.replace(router.asPath)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadinApplyingJob(false)
    }
  }

  async function getJob() {
    try {
      setLoading(true)
      const result = await axios.get(`/jobs/${params.id}`)

      setJob(result.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getJob()
      // console.log('it runs')
    }
  }, [router])

  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>
          {job?.detail.title} - {job?.detail.company.name} | JoFi
        </title>
      </Head>

      {/* <JsonView data={job} /> */}

      <div id="job-detail-wrapper">
        <header id="job-detail__header" className="flex items-center gap-6">
          <div id="job-detail__company-image">
            {loading ? (
              <div className="skeleton w-32 h-32 rounded-none"></div>
            ) : (
              <img
                className="w-32"
                src={generateCompanyLogoUrl(job?.detail.company.logo as string)}
                alt={`${job?.detail.company.name}'s image`}
              />
            )}
          </div>

          {loading ? (
            <div className="skeleton w-full h-[176px] rounded-none"></div>
          ) : (
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold">{job?.detail.title}</h3>
              <Link
                href={`/companies/${job?.detail.company.slug}`}
                className="hover:underline"
              >
                {job?.detail.company.name}
              </Link>

              <div className="flex gap-2 items-center text-sm">
                {/* <Icon icon="mdi:map" width="20" height="20" /> */}
                <span className="text-[16px]">🗺️</span>
                {job?.detail.location}
              </div>

              <div className="flex gap-2 items-center text-sm">
                {/* <Icon
                  icon="mdi:clock-time-five-outline"
                  width="20"
                  height="20"
                /> */}
                <span className="text-[16px]">📅</span>
                Posted at {dayjs(job?.detail.createdAt).format('MMM DD YYYY')}
              </div>

              <div className="text-sm font-semibold flex items-center gap-2">
                {/* <Icon icon="mdi:cash" width="20" height="20" /> */}
                <span className="text-[16px]">💵</span>
                {job?.detail.salary ?? 0 < 1
                  ? 'Confidential'
                  : convertRupiah((job?.detail.salary ?? 0) as number, {
                      floatingPoint: 0,
                    })}
              </div>

              <div className="mt-4 flex gap-2">
                <BtnToggleSaveJob
                  jobId={job?.detail.id as number}
                  saved={job?.detail.saved as boolean}
                  withText
                  className="text-sm flex items-center bg-secondary btn btn-sm"
                  iconSize={16}
                  onToggle={() => router.replace(router.asPath)}
                />

                {job?.detail.active ? (
                  <button
                    className="btn btn-primary btn-sm text-base-100"
                    disabled={job?.detail.applied}
                    onClick={() => applyJob()}
                  >
                    {job?.detail.applied ? 'Applied' : 'Apply this job'}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm btn-disabled"
                    disabled={job?.detail.active}
                  >
                    Closed
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="divider"></div>

        <div className="grid lg:grid-cols-[auto_400px] w-full h-full gap-4">
          <div className="w-full">
            <div id="job-detail__description">
              <h4 className="text-lg font-semibold uppercase">
                Job description
              </h4>
              {loading ? (
                <div className="skeleton h-[40px] w-full rounded-none"></div>
              ) : (
                <div
                  className="mt-2 job-description-paragraph trix-content xl:pr-4"
                  dangerouslySetInnerHTML={{
                    __html: job?.detail.description ?? '',
                  }}
                ></div>
              )}
            </div>

            {/* <div id="job-detail__requirements" className="mt-6">
              <h4 className="text-lg font-semibold uppercase">Requirements</h4>
              <div className="text-sm mt-2">
                <ul className="list-disc pl-5">
                  {!loading
                    ? job?.detail.requirements
                        .split('~')
                        .map((r: string, i: number) => <li key={i}>{r}</li>)
                    : Array.from({ length: 5 }, (v, i) => (
                        <li className="skeleton h[20px] w-full mt-1"></li>
                      ))}
                </ul>
              </div>
            </div> */}
          </div>

          <div className="w-full lg:mt-0 mt-10">
            <div>
              <h4 className="font-semibold">More from this company</h4>
              <div className="flex flex-col gap-2 mt-4">
                {!loading && job?.moreFromCompany.length ? (
                  job?.moreFromCompany.map((jobFromCompany: any, i) => (
                    <JobCard
                      key={i}
                      jobData={jobFromCompany}
                      onSaveToggle={() => router.replace(router.asPath)}
                    />
                  ))
                ) : loading ? (
                  <div className="skeleton w-[400px] h-[248px] rounded-none"></div>
                ) : (
                  <div className="text-sm text-secondary text-center">
                    No other jobs from this company
                  </div>
                )}
              </div>
            </div>

            <div className="divider py-6"></div>

            <div>
              <h4 className="font-semibold">
                More from "{job?.detail.category.name}" category
              </h4>
              <div className="flex flex-col gap-2 mt-4">
                {!loading && job?.relatedJobs.length ? (
                  job?.relatedJobs.map((relatedJob: any, i) => (
                    <JobCard
                      key={i}
                      jobData={relatedJob}
                      onSaveToggle={() => router.replace(router.asPath)}
                    />
                  ))
                ) : loading ? (
                  <div className="skeleton w-[400px] h-[248px] rounded-none"></div>
                ) : (
                  <div className="text-sm text-secondary text-center">
                    No related jobs
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default JobDetailPage
