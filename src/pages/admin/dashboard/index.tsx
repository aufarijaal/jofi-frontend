import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/context/AuthContext'
import { GetServerSideProps } from 'next'
import { toast } from 'react-toastify'

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const auth = useAuthContext()

  function getStats() {
    setLoading(true)
    axios
      .get('/admin/stats')
      .then((result) => {
        setData(result.data.data)
      })
      .catch((error) => {
        console.log(`error occurred. status: ${error.response.status}`)
      })
      .finally(() => {
        setLoading(false)
        console.log('You do not have access to the route')
      })
  }

  const [data, setData] = useState<{
    users: number
    companies: number
    jobCategories: number
  }>()

  useEffect(() => {
    getStats()
  }, [])

  return (
    <main className="min-h-screen w-full px-4 max-w-7xl mx-auto pt-24 pb-32">
      <Head>
        <title>Admin Dashboard | JoFi</title>
      </Head>

      {loading && auth?.isLoading ? (
        <div className="min-h-full w-full grid place-items-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <>
          <header className="mb-10 text-2xl font-semibold">
            <h3>📊 Admin Dashboard</h3>
          </header>
          <div className="stats shadow-lg w-full">
            <div className="stat">
              <div className="stat-figure text-success">
                <Icon icon="mdi:account" width="32" height="32" />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{data?.users}</div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>

            <div className="stat">
              <div className="stat-figure text-warning">
                <Icon icon="heroicons:building-office" width="32" height="32" />
              </div>
              <div className="stat-title">Total Companies</div>
              <div className="stat-value">{data?.companies}</div>
              {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <Icon icon="mdi:shape-outline" width="32" height="32" />
              </div>
              <div className="stat-title">Job Categories</div>
              <div className="stat-value">{data?.jobCategories}</div>
              {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default AdminDashboard
