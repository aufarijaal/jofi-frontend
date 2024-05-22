import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { generateCompanyLogoUrl } from '@/lib/utils'
import Link from 'next/link'
import JobCard from '@/components/job-card/job-card'
import { JsonView } from 'react-json-view-lite'
import { useParams } from 'next/navigation'

interface CompanyDetail {
  id: number
  name: string
  logo: string
  slug: string
  about: string
  industry: string
  location: string
  jobs: Job[]
}
interface Job {
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
}

// export const getServerSideProps = (async (ctx) => {
//   try {
//     const result = await axios.get(`/companies/${ctx.params?.slug}`, {
//       headers: {
//         Authorization: ctx.req.cookies.accessToken,
//       },
//     })

//     return {
//       props: {
//         company: result.data.data,
//       },
//     }
//   } catch (error) {
//     if (error instanceof AxiosError && error.status === 404) {
//       return {
//         notFound: true,
//       }
//     }

//     return {
//       props: {
//         company: {},
//       },
//     }
//   }
// }) satisfies GetServerSideProps<{ company: CompanyDetail }>

const CompanyDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const [company, setCompany] = useState<CompanyDetail>()

  async function getCompany() {
    try {
      const result = await axios.get(`/companies/${params.slug}`)

      setCompany(result.data.data)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        if (error.status === 401) {
          window.location.href = '/unauthorized'
        } else if (error.status === 404) {
          window.location.href = '/404'
        }
      }
    }
  }

  useEffect(() => {
    getCompany()
  }, [])

  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>{company?.name} - Company Detail | JoFi</title>
      </Head>

      <div>
        <header className="flex gap-10">
          <img
            className="w-40 object-contain rounded-full"
            src={generateCompanyLogoUrl(company?.logo as string)}
            alt={`${company?.name}' image`}
          />

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{company?.name}</h2>

            <div className="mt-4 flex flex-col gap-2">
              <div className="text-sm flex flex-col gap-1">
                <span>Headquarters: </span>
                <span className="font-semibold">{company?.location}</span>
              </div>
              <div className="text-sm flex flex-col gap-1">
                <span>Industry: </span>
                <span className="font-semibold">{company?.industry}</span>
              </div>
            </div>
          </div>

          <div className="flex-grow flex justify-end items-end">
            <Link
              href={{
                pathname: '/',
                query: {
                  q: company?.name,
                },
              }}
              className="btn btn-accent"
            >
              See All Jobs
            </Link>
          </div>
        </header>

        <div className="divider my-6"></div>

        <div id="company-detail__about">
          <h4 className="text-lg font-semibold uppercase">About</h4>
          <p className="text-sm mt-2 text-justify">{company?.about}</p>
        </div>

        <div id="company-detail__jobs-from-this-company" className="mt-10">
          <h4 className="text-lg font-semibold">Jobs from {company?.name}</h4>

          <div className="mt-2 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {company && company?.jobs.length > 0 ? (
              company?.jobs.map((job: Job) => (
                <JobCard
                  jobData={job}
                  noCompanyInfo
                  onSaveToggle={() => router.replace(router.asPath)}
                />
              ))
            ) : (
              <div className="text-sm text-secondary">
                This company has no active jobs.
              </div>
            )}
          </div>
        </div>

        {/* <JsonView data={company.jobs} /> */}
      </div>
    </main>
  )
}

export default CompanyDetailPage
