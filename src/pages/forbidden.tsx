import { useAuthContext } from '@/context/AuthContext'
import { Icon } from '@iconify-icon/react'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const ForbiddenPage = () => {
  const auth = useAuthContext()

  return (
    <main className="min-h-screen w-full px-4 max-w-7xl mx-auto grid place-items-center">
      <Head>
        <title>Forbidden | JoFi</title>
      </Head>

      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-6xl font-bold">403</h2>
        <div>Forbidden</div>

        <Link
          href={
            auth?.user?.role === 'ADMIN'
              ? '/admin/dashboard'
              : auth?.user?.role === 'EMPLOYER'
              ? '/employer/dashboard'
              : '/'
          }
          className="btn"
        >
          <Icon icon="mdi:home" />
          Go to home
        </Link>
      </div>
    </main>
  )
}

export default ForbiddenPage
