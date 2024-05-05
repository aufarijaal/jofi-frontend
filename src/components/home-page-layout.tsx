import { cn } from '@/lib/utils'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const HomePageLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  const router = useRouter()
  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Find your dream jobs!</h1>
            <p className="py-6">
              The best job seeking platform providing various job vacancies to
              help you start reach your career path.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-10">
        <Link
          href="/"
          className={cn([
            'link link-hover text-sm font-semibold',
            router.pathname === '/' ? 'text-accent' : '',
          ])}
        >
          Explore
        </Link>
        <Link
          href="/saved"
          className={cn([
            'link link-hover text-sm font-semibold',
            router.pathname.includes('/saved') ? 'text-accent' : '',
          ])}
        >
          Saved
        </Link>
        <Link
          href="/applied"
          className={cn([
            'link link-hover text-sm font-semibold',
            router.pathname.includes('/applied') ? 'text-accent' : '',
          ])}
        >
          Applied
        </Link>
      </div>

      <div>{children}</div>
    </main>
  )
}

export default HomePageLayout
