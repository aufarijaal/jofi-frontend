import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

function BtnToggleSaveJob({
  saved,
  className,
  withText,
  iconSize,
  jobId,
  onToggle,
}: {
  saved: boolean
  withText?: boolean
  className?: string
  iconSize?: string | number
  jobId: number
  onToggle?: () => void
}) {
  const auth = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick(e: any) {
    e.stopPropagation()
    e.preventDefault()

    try {
      setLoading(true)

      if (!auth?.user) {
        return router.push('/auth/signin')
      }

      if (saved && jobId) {
        await axios.delete(`/saved-jobs/${jobId}`)
      } else
        await axios.post(`/saved-jobs`, {
          jobId,
        })

      onToggle?.()
    } catch (error: any) {
      alert(
        error instanceof AxiosError
          ? error.response?.data.message
          : error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className={className} onClick={handleClick} disabled={loading}>
      {saved ? (
        <>
          <Icon
            icon="mdi:bookmark"
            width={iconSize ?? '24'}
            height={iconSize ?? '24'}
          />
          {withText && 'Saved'}
        </>
      ) : (
        <>
          <Icon
            icon="mdi:bookmark-outline"
            width={iconSize ?? '24'}
            height={iconSize ?? '24'}
          />
          {withText && 'Save'}
        </>
      )}
    </button>
  )
}

export default BtnToggleSaveJob
