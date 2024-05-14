import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const FormProfileAbout: React.FC<{
  existingAbout?: string
  onSuccess?: () => void
}> = ({ existingAbout, onSuccess }) => {
  const maxLength = 300
  const schema = z.object({
    about: z.string().trim().max(maxLength),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      about: existingAbout ?? '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setIsLoading(true)
      await axios.put(`/account/profile/about`, data)

      onSuccess?.()
      toast.success("About updated successfully")
    } catch (error) {
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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      id="form-profile-about"
      className="max-w-md flex flex-col gap-2"
    >
      <div>
        <h4 className="text-lg font-semibold">About</h4>
      </div>

      {form.formState.errors?.root?.message && (
        <div>
          <p className="text-xs text-error">
            {form.formState.errors?.root?.message}
          </p>
        </div>
      )}

      <label className="form-control max-w-md">
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="About"
          maxLength={maxLength}
          disabled={isLoading}
          {...form.register('about')}
        ></textarea>
        <div className="label">
          <div className="label-text-alt text-error">
            {form.formState.errors.about?.message}
          </div>
          <div className="label-text-alt">
            {form.watch('about').length} / {maxLength}
          </div>
        </div>
      </label>

      <button
        className="btn btn-sm btn-accent w-max btn-l"
        type="submit"
        disabled={isLoading || !form.formState.isDirty}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        {isLoading ? 'Submiting' : 'Submit'}
      </button>
    </form>
  )
}

export default FormProfileAbout
