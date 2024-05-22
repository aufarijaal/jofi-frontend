import FormChangeEmail from '@/components/forms/form-change-email'
import FormChangeName from '@/components/forms/form-change-name'
import FormPhotoProfile from '@/components/forms/form-photo-profile'
import FormResetPassword from '@/components/forms/form-reset-password'
import SettingsPageLayout from '@/components/settings-page-layout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const result = await axios.get(`/account/settings`, {
//     headers: {
//       Authorization: ctx.req.cookies.accessToken,
//     },
//   })

//   return {
//     props: {
//       info: result.data.data,
//     },
//   }
// }

const SettingsPage = () => {
  const router = useRouter()
  const [info, setInfo] = useState<{
    email: string;
    profile: {
      photo: string | null;
      name: string;
    } | null;
  }>()

  function refresh() {
    router.replace(router.asPath)
  }

  async function getInfo() {
    try {
      const result = await axios.get(`/account/settings`)

      setInfo(result.data.data)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        if (error.status === 401) {
          window.location.href = '/unauthorized'
        }
      }
    }
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <SettingsPageLayout title="Settings | JoFi" headerTitle="Settings">
      <div>
        {info && <FormPhotoProfile
          existingPhoto={info.profile!.photo as string}
          onSuccess={() => refresh()}
        />}
      </div>

      <div className="divider"></div>

      <div>
        {info && <FormChangeName
          existingName={info.profile!.name}
          onSuccess={() => refresh()}
        />}
      </div>

      <div className="divider"></div>

      <div>
        {info && <FormChangeEmail
          existingEmail={info.email}
          onSuccess={() => refresh()}
        />}
      </div>

      <div className="divider"></div>

      <div>
        <FormResetPassword onSuccess={() => refresh()} />
      </div>
    </SettingsPageLayout>
  )
}

export default SettingsPage
