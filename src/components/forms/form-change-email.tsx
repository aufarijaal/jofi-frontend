import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import axios from '@/lib/axios'

const FormChangeEmail: React.FC<{
  existingEmail: string
  onSuccess?: () => void
}> = ({ existingEmail, onSuccess }) => {
  const schema = z.object({
    email: z.string().trim().email(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: existingEmail,
    },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      await axios.put(`/account/settings/email`, data)

      onSuccess?.()
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
      id="form-change-email"
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-sm flex flex-col gap-2"
    >
      <div>
        <h4 className="text-lg font-semibold">Change email</h4>
      </div>

      {form.formState.errors?.root?.message && (
        <div>
          <p className="text-xs text-error">
            {form.formState.errors?.root?.message}
          </p>
        </div>
      )}

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          type="email"
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          {...form.register('email', { required: true })}
        />
        {form.formState.errors.email?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.email.message}
            </div>
          </div>
        )}
      </label>

      <button className="btn btn-sm btn-accent w-max" type="submit">
        Submit
      </button>
    </form>
  )
}

export default FormChangeEmail
