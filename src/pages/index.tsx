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

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const jobs = await axios.get(`/jobs`, {
//     params: {
//       dataPerPage: ctx.query.dataPerPage ?? 10,
//       page: ctx.query.page ?? 1,
//       q: ctx.query.q ?? '',
//       sortBy: ctx.query.sortBy ?? 'recentlyPosted',
//       category: ctx.query.category ?? 'all',
//     },
//     headers: {
//       Authorization: ctx.req.cookies.accessToken,
//     },
//   })
//   const jobCategoriesFetch = await axios.get('/job-categories')

//   return {
//     props: {
//       jobs: jobs.data.data.jobPosts,
//       pagination: jobs.data.data.pagination,
//       jobCategoriesProps: jobCategoriesFetch.data.data,
//     },
//   }
// }

export default function Home() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(
    (router.query.q as string) ?? ''
  )
  const [jobs, setJobs] = useState([])
  const [jobCategories, setJobCategories] = useState([])
  const [pagination, setPagination] = useState<{ hasNextPage: boolean; hasPreviousPage: boolean }>()
  const [loading, setLoading] = useState(true)

  function refresh(newParam: Record<string, any>) {
    router.replace({
      pathname: '/',
      query: {
        ...router.query,
        ...newParam,
      },
    })
  }

  async function getJobs() {
    try {
      setLoading(true)

      const jobs = await axios.get(`/jobs`, {
        params: {
          dataPerPage: router.query.dataPerPage ?? 10,
          page: router.query.page ?? 1,
          q: router.query.q ?? '',
          sortBy: router.query.sortBy ?? 'recentlyPosted',
          category: router.query.category ?? 'all',
        }
      })

      const jobCategoriesFetch = await axios.get('/job-categories')

      setJobs(jobs.data.data.jobPosts)
      setPagination(jobs.data.data.pagination)
      setJobCategories(jobCategoriesFetch.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getJobs()
      console.log('triggered')
      console.log(router.query)
    }
  }, [router.query.category, router.query.sortBy, router.query.q])

  return (
    <HomePageLayout title="JoFi">
      {/* Job search & filter */}
      <div className="mt-6">
        <div className="toolbar flex flex-col gap-2">
          <div className="toolbar__line-2 flex items-center gap-4">
            <form
              id="employer-job-search"
              className="flex gap-2 flex-grow"
              onSubmit={(e) => {
                e.preventDefault()
                refresh({ q: searchValue })
              }}
            >
              <input
                type="text"
                className="input input-bordered input-sm flex-grow"
                placeholder="Search job title..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="btn btn-accent btn-sm" type="submit">
                <Icon icon="heroicons:magnifying-glass-20-solid" />
              </button>
            </form>
          </div>
          <div className="toolbar__line-1 flex items-center gap-4">
            <div className="text-xs">Sort by</div>
            {loading ? <div className="skeleton w-[246px] h-[32px] rounded-none"></div> : router.isReady && <select
              className="select select-bordered select-sm"
              defaultValue={router.query.sortBy ?? 'recentlyPosted'}
              onChange={(e) => refresh({ sortBy: e.target.value })}
            >
              <option value="mostRelevant">Most Relevant</option>
              <option value="highestSalary">Highest Salary</option>
              <option value="recentlyPosted">Recently Posted</option>
            </select>}

            <div className="flex items-center gap-2">
              <div className="text-xs">Category</div>
              {loading ? <div className="skeleton w-[246px] h-[32px] rounded-none"></div> : router.isReady && jobCategories && <select
                className="select select-sm select-bordered w-full"
                defaultValue={router.query.category ?? 'all'}
                onChange={(e) => {
                  refresh({ category: e.target.value })
                }}
              >
                <option value={'all'}>All</option>
                {jobCategories?.map((category: any) => (
                  <option
                    value={category.slug}
                    title={category.slug}
                    key={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>}
            </div>
          </div>
        </div>
      </div>

      {/* Job post list */}
      <div id="job-list-container" className="mt-6">
        {!loading && jobs.length > 0 ? (
          <div
            id="job-list"
            className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"
          >
            {jobs.map((job: any, i: number) => (
              <JobCard
                key={i}
                jobData={job}
                onSaveToggle={() => getJobs()}
              />
            ))}
          </div>
        ) : loading ? <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {Array.from({ length: 10 }, (v, i) => (<div className="skeleton w-[355px] h-[248px]" key={i}></div>))}
        </div> : (
          <div className="grid place-items-center w-full text-secondary text-sm h-[100px]">
            {'No result found'}
          </div>
        )}

        <div className="w-full mt-6 flex justify-end gap-2">
          {pagination && <button
            className="btn btn-sm btn-accent"
            onClick={() =>
              refresh({
                page:
                  router.query.page ||
                    !isNaN(parseInt(router.query.page as string))
                    ? parseInt(router.query.page as string) - 1
                    : 1,
              })
            }
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </button>}
          {pagination && <button
            className="btn btn-sm btn-accent"
            onClick={() =>
              refresh({
                page:
                  router.query.page ||
                    !isNaN(parseInt(router.query.page as string))
                    ? parseInt(router.query.page as string) + 1
                    : 2,
              })
            }
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>}
        </div>
      </div>
    </HomePageLayout>
  )
}
