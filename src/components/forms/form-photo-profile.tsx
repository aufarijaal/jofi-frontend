import { generatePhotoProfileUrl } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from '@/lib/axios'
import { toast } from 'sonner'

const FormPhotoProfile: React.FC<{
  existingPhoto?: string
  onSuccess?: () => void
}> = ({ existingPhoto, onSuccess }) => {
  const schema = z.object({
    pp: z
      .custom<FileList>()
      .transform((files: FileList) => files[0])
      .refine((file) => file.type.split('/')[0] === 'image', {
        message: 'File is not type of image',
      }),
  })
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('pp', data.pp)

      await axios.put(`/account/settings/pp`, formData)

      onSuccess?.()
      form.reset()
      toast.success("Photo profile updated")
    } catch (error) {
      console.error(error)
      
      if (error instanceof AxiosError) {
        form.setError('root', {
          message: error.response?.data.message,
        })
        toast.error(error.response?.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function removePhoto() {
    try {
      if (confirm('Are you sure want to remove your photo profile?')) {
        await axios.delete(`/account/settings/pp`)

        onSuccess?.()
      }
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        form.setError('root', {
          message: error.response?.data.message,
        })
      }
    }
  }

  return (
    <form
      id="form-photo-profile"
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-sm flex flex-col gap-2"
    >
      <div>
        <h4 className="text-lg font-semibold">Photo Profile</h4>
      </div>

      {form.formState.errors?.root?.message && (
        <div>
          <p className="text-xs text-error">
            {form.formState.errors?.root?.message}
          </p>
        </div>
      )}

      <div>
        <div className="relative w-max h-max">
          <img
            src={generatePhotoProfileUrl(existingPhoto ?? 'not-found.jpg')}
            alt="Photo profile"
            className="w-24 h-24 rounded-full object-cover"
          />

          <button
            className="btn btn-sm btn-circle btn-error absolute top-0 -right-4"
            title="Remove photo"
            type="button"
            onClick={() => removePhoto()}
          >
            <Icon icon="mdi:trash-can" width="18" height="18" />
          </button>
        </div>

        <label className="form-control w-full max-w-xs mt-4">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs file-input-sm"
            accept="image/*"
            disabled={isLoading}
            {...form.register('pp', { required: true })}
          />
          {form.formState.errors?.pp?.message && (
            <div className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors?.pp?.message}
              </span>
            </div>
          )}
        </label>
      </div>

      <button
        className="btn btn-sm btn-accent w-max btn-l"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        {isLoading ? 'Submiting' : 'Submit'}
      </button>
    </form>
  )
}

export default FormPhotoProfile
