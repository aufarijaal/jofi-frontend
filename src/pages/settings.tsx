import FormChangeEmail from '@/components/forms/form-change-email'
import FormChangeName from '@/components/forms/form-change-name'
import FormPhotoProfile from '@/components/forms/form-photo-profile'
import FormResetPassword from '@/components/forms/form-reset-password'
import SettingsPageLayout from '@/components/settings-page-layout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await axios.get(`/account/settings`, {
    headers: {
      Authorization: ctx.req.cookies.accessToken,
    },
  })

  return {
    props: {
      info: result.data.data,
    },
  }
}

const SettingsPage = ({ info }: any) => {
  const router = useRouter()

  function refresh() {
    router.replace(router.asPath)
  }

  return (
    <SettingsPageLayout title="Settings | JoFi" headerTitle="Settings">
      <div>
        <FormPhotoProfile
          existingPhoto={info.profile.photo}
          onSuccess={() => refresh()}
        />
      </div>

      <div className="divider"></div>

      <div>
        <FormChangeName
          existingName={info.profile.name}
          onSuccess={() => refresh()}
        />
      </div>

      <div className="divider"></div>

      <div>
        <FormChangeEmail
          existingEmail={info.email}
          onSuccess={() => refresh()}
        />
      </div>

      <div className="divider"></div>

      <div>
        <FormResetPassword onSuccess={() => refresh()} />
      </div>
    </SettingsPageLayout>
  )
}

export default SettingsPage
