import { Icon } from '@iconify-icon/react'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const ForbiddenPage = () => {
  return (
    <main className="min-h-screen w-full px-4 max-w-7xl mx-auto grid place-items-center">
      <Head>
        <title>Unauthorized | JoFi</title>
      </Head>

      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-6xl font-bold">401</h2>
        <div>Unauthorized</div>

        <Link href="/" className="btn">
          <Icon icon="mdi:home" />
          Go to home
        </Link>
      </div>
    </main>
  )
}

export default ForbiddenPage
