import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import React from 'react'
import axios from '@/lib/axios'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'

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
  const auth = useAuthContext();
  const router = useRouter();

  async function handleClick(e: any) {
    e.stopPropagation()
    e.preventDefault()

    if(!auth?.user) {
      return router.push('/auth/signin')
    }

    if (saved && jobId) {
      await axios.delete(`/saved-jobs/${jobId}`)
    } else
      await axios.post(`/saved-jobs`, {
        jobId,
      })

    onToggle?.()
  }

  return (
    <button className={className} onClick={handleClick}>
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
