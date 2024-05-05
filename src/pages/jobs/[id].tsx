import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
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
import { redirect } from 'next/navigation'

interface JobProps {
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

export const getServerSideProps = (async (ctx) => {
  try {
    const job = await axios.get(`/jobs/${ctx.params?.id}`, {
      headers: {
        Authorization: ctx.req.cookies.accessToken,
      },
    })

    return {
      props: {
        job: job.data.data,
      },
    }
  } catch (error) {
    if (error instanceof AxiosError && error.status === 404) {
      return {
        notFound: true,
        props: {
          job: {},
        },
      }
    }

    return {
      props: {
        job: {},
      },
    }
  }
}) satisfies GetServerSideProps<{ job: JobProps }>

const JobDetailPage = ({
  job,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const auth = useAuthContext()

  async function applyJob() {
    try {
      if (!auth?.user) {
        return router.push('/auth/signin')
      }

      await axios.post(`/jobs/${job.detail.id}/apply`)

      router.replace(router.asPath)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>
          {job.detail.title} - {job.detail.company.name} | JoFi
        </title>
      </Head>

      {/* <JsonView data={job} /> */}

      <div id="job-detail-wrapper">
        <header id="job-detail__header" className="flex items-center gap-6">
          <div id="job-detail__company-image">
            <img
              className="w-32"
              src={generateCompanyLogoUrl(job.detail.company.logo)}
              alt={`${job.detail.company.name}'s image`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">{job.detail.title}</h3>
            <Link
              href={`/companies/${job.detail.company.slug}`}
              className="hover:underline"
            >
              {job.detail.company.name}
            </Link>

            <div className="flex gap-2 items-center text-sm">
              <Icon icon="mdi:map" width="20" height="20" />
              {job.detail.location}
            </div>

            <div className="flex gap-2 items-center text-sm">
              <Icon icon="mdi:clock-time-five-outline" width="20" height="20" />
              Posted at {dayjs(job.detail.createdAt).format('MMM DD YYYY')}
            </div>

            <div className="text-sm font-semibold flex items-center gap-2">
              <Icon icon="mdi:cash" width="20" height="20" />
              {convertRupiah(job.detail.salary, { floatingPoint: 0 })}
            </div>

            <div className="mt-4 flex gap-2">
              <BtnToggleSaveJob
                jobId={job.detail.id}
                saved={job.detail.saved}
                withText
                className="text-sm flex items-center bg-secondary btn btn-sm"
                iconSize={16}
                onToggle={() => router.replace(router.asPath)}
              />
              <button
                className="btn btn-primary btn-sm text-base-100"
                disabled={job.detail.applied}
                onClick={() => applyJob()}
              >
                {job.detail.applied ? 'Applied' : 'Apply this job'}
              </button>
            </div>
          </div>
        </header>

        <div className="divider"></div>

        <div className="grid lg:grid-cols-[auto_400px] w-full h-full gap-4">
          <div className="w-full">
            <div id="job-detail__description">
              <h4 className="text-lg font-semibold uppercase">
                Job description
              </h4>
              <p className="text-sm mt-2 text-justify">
                {job.detail.description}
              </p>
            </div>

            <div id="job-detail__requirements" className="mt-6">
              <h4 className="text-lg font-semibold uppercase">Requirements</h4>
              <div className="text-sm mt-2">
                <ul className="list-disc pl-5">
                  {job.detail.requirements
                    .split('~')
                    .map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:mt-0 mt-10">
            <div>
              <h4 className="font-semibold">More from this company</h4>
              <div className="flex flex-col gap-2 mt-4">
                {job.moreFromCompany.length ? (
                  job.moreFromCompany.map((jobFromCompany: any) => (
                    <JobCard
                      jobData={jobFromCompany}
                      onSaveToggle={() => router.replace(router.asPath)}
                    />
                  ))
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
                More from "{job.detail.category.name}" category
              </h4>
              <div className="flex flex-col gap-2 mt-4">
                {job.relatedJobs.length ? (
                  job.relatedJobs.map((relatedJob: any) => (
                    <JobCard
                      jobData={relatedJob}
                      onSaveToggle={() => router.replace(router.asPath)}
                    />
                  ))
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
