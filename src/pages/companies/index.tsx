import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { generateCompanyLogoUrl } from '@/lib/utils'
import Link from 'next/link'

interface CompaniesProps {
  count: number
  pagination: Pagination
  companies: Company[]
}
interface Company {
  id: number
  name: string
  logo: string
  slug: string
}
interface Pagination {
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
}

export const getServerSideProps = (async (ctx) => {
  try {
    const result = await axios.get(`/companies`, {
      params: {
        dataPerPage: ctx.query.dataPerPage ?? 10,
        page: ctx.query.page ?? 1,
        q: ctx.query.q ?? '',
      },
    })

    return {
      props: {
        companies: result.data.data.companies,
        pagination: result.data.data.pagination,
        count: result.data.data.count,
      },
    }
  } catch (error) {
    if (error instanceof AxiosError && error.status === 404) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        companies: {},
        pagination: {},
        count: 0,
      },
    }
  }
}) satisfies GetServerSideProps<CompaniesProps>

const CompaniesPage = ({
  companies,
  count,
  pagination,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(
    (router.query.q as string) ?? ''
  )

  function refresh(newParam: Record<string, any>) {
    router.replace({
      pathname: '/companies',
      query: {
        ...router.query,
        ...newParam,
      },
    })
  }

  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>Companies | JoFi</title>
      </Head>

      <div>
        <div className="companies-search">
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
              placeholder="Search company name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="btn btn-accent btn-sm" type="submit">
              <Icon icon="heroicons:magnifying-glass-20-solid" />
            </button>
          </form>
        </div>

        <div
          id="company-list"
          className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 place-items-center"
        >
          {companies.map((company: Company) => {
            return (
              <Link
                href={`/companies/${company.slug}`}
                className="company-item card bg-base-100 shadow-xl w-full"
                key={company.id}
              >
                <div className="card-body flex flex-col items-center gap-2">
                  <img
                    className="w-14 h-14 object-contain rounded-full"
                    src={generateCompanyLogoUrl(company.logo)}
                    alt={`${company.name}'s image`}
                  />
                  <h4 className="font-bold text-lg">{company.name}</h4>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="w-full mt-6 flex justify-end gap-2">
          <button
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
          </button>
          <button
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
          </button>
        </div>
      </div>
    </main>
  )
}

export default CompaniesPage
