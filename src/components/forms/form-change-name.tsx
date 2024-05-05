import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import axios from '@/lib/axios'

const FormChangeName: React.FC<{
  existingName: string
  onSuccess?: () => void
}> = ({ existingName, onSuccess }) => {
  const schema = z.object({
    name: z.string().trim().min(3, 'Name must have at least 3 characters'),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existingName,
    },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      await axios.put(`/account/settings/name`, data)

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
      id="form-change-name"
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-sm flex flex-col gap-2"
    >
      <div>
        <h4 className="text-lg font-semibold">Change Name</h4>
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
          <span className="label-text">Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          {...form.register('name', { required: true })}
        />
        {form.formState.errors.name?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.name.message}
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

export default FormChangeName
