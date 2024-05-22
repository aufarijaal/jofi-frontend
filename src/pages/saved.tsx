import JobCard from '@/components/job-card/job-card'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import axios from '@/lib/axios'
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/router'
import { JsonView } from 'react-json-view-lite'
import HomePageLayout from '@/components/home-page-layout'
import { useAuthContext } from '@/context/AuthContext'
import { redirect } from 'next/navigation'

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   if(!ctx.req.cookies.accessToken) {
//     return {
//       redirect: '/auth/signin',
//       props: {}
//     }
//   }

//   const savedJobs = await axios.get(`/saved-jobs`, {
//     headers: {
//       Authorization: ctx.req.cookies.accessToken,
//     },
//   })


//   return {
//     props: {
//       savedJobs: savedJobs.data.data,
//     },
//   }
// }

export default function Home() {
  const router = useRouter()
  const auth = useAuthContext()
  const [savedJobs, setSavedJobs] = useState([])

  async function getSavedJobs() {
    try {
      const result = await axios.get(`/saved-jobs`)

      setSavedJobs(result.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSavedJobs()
  }, [])

  return (
    <HomePageLayout title="JoFi - Saved Jobs">
      {/* Saved jobs list */}
      <div id="saved-job-list-container" className="mt-6">
        {auth?.user ? (
          <div
            id="saved-job-list"
            className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"
          >
            {savedJobs.length > 0 ? (
              savedJobs.map((savedJob: any, i: number) => (
                <JobCard key={i} jobData={savedJob.job} noToggleSaveButton />
              ))
            ) : (
              <div className="text-sm">You don't have any saved jobs</div>
            )}
          </div>
        ) : (
          <div>Please sign in to see your saved jobs. <Link className="hover:underline" href="/auth/signin">Sign in</Link></div>
        )}
      </div>
    </HomePageLayout>
  )
}
