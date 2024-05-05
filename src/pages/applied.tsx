import JobCard from '@/components/job-card/job-card'
import { useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import axios from '@/lib/axios'
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/router'
import { JsonView } from 'react-json-view-lite'
import HomePageLayout from '@/components/home-page-layout'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/context/AuthContext'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if(!ctx.req.cookies.accessToken) {
    return {
      redirect: '/auth/signin',
      props: {}
    }
  }

  const appliedJobs = await axios.get(`/applications`, {
    headers: {
      Authorization: ctx.req.cookies.accessToken,
    },
  })

  return {
    props: {
      appliedJobs: appliedJobs.data.data,
    },
  }
}

export default function Home({ appliedJobs }: any) {
  const router = useRouter()
  const auth = useAuthContext()

  function badgeColor(
    status: 'RECEIVED' | 'INTERVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  ) {
    switch (status) {
      case 'APPROVED':
        return 'badge-success'
      case 'REJECTED':
        return 'badge-error'
      case 'UNDER_REVIEW':
      case 'RECEIVED':
        return 'badge-secondary'
      case 'INTERVIEW':
        return 'badge-info'
      default:
        return ''
    }
  }

  return (
    <HomePageLayout title="JoFi - Applied Jobs">
      {/* Applied jobs list */}
      <div id="applied-job-list-container" className="mt-6">
        {auth?.user ? <div
          id="applied-job-list"
          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"
        >
          {appliedJobs.length > 0 ? (
            appliedJobs.map((appliedJob: any, i: number) => (
              <JobCard
                key={i}
                jobData={appliedJob.job}
                noToggleSaveButton
                additonalActions={
                  <div>
                    <div
                      className={cn([
                        'badge font-bold',
                        badgeColor(appliedJob.status),
                      ])}
                    >
                      {appliedJob.status}
                    </div>
                  </div>
                }
              ></JobCard>
            ))
          ) : (
            <div className="text-sm">You are not applied to any jobs</div>
          )}
        </div> : <div>Please sign in to see your applied jobs. <Link className="hover:underline" href="/auth/signin">Sign in</Link></div>}
      </div>
    </HomePageLayout>
  )
}
