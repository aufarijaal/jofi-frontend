import { Icon } from '@iconify-icon/react'
import React, { useRef } from 'react'
import axios from '@/lib/axios'

const FormUploadCompanyLogo: React.FC<{
  id: number
  onSuccess: () => void
  onError: (error: any) => void
  [x: string]: any
}> = ({ id, onSuccess, onError, ...props }) => {
  const inputFileRef = useRef<HTMLInputElement>(null)

  async function upload() {
    try {
      if (inputFileRef.current?.files && inputFileRef.current?.files[0]) {
        await axios.put(
          `/companies/${id}/logo-upload`,
          {
            logo: inputFileRef.current.files[0],
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      onError(error)
    }
  }

  return (
    <form {...props}>
      <input
        type="file"
        hidden
        ref={inputFileRef}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onChange={upload}
        accept="image/*"
      />

      <button
        className="btn btn-xs btn-outline btn-primary"
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          inputFileRef.current?.click()
        }}
      >
        <Icon icon="fluent:image-edit-16-regular" width="16" height="16" />
      </button>
    </form>
  )
}

export default FormUploadCompanyLogo
