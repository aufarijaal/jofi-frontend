import FormResetPassword from '@/components/forms/form-reset-password'
import Head from 'next/head'
import React from 'react'

const SettingsPageLayout = ({
  title,
  headerTitle,
  children,
}: {
  title: string
  headerTitle: string
  children: React.ReactNode
}) => {
  return (
    <main className="min-h-screen w-full pt-24 px-4 max-w-7xl mx-auto pb-10">
      <Head>
        <title>{title}</title>
      </Head>

      <header>
        <h3 className="text-2xl font-semibold">{headerTitle}</h3>
      </header>

      <div className="divider"></div>

      <div className="mt-10">{children}</div>
    </main>
  )
}

export default SettingsPageLayout
