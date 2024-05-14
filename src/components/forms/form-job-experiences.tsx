import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { toast } from 'sonner'

const FormJobExperiences: React.FC<{
  onSuccess?: () => void
  existing?: {
    id: number
    title: string
    companyName: string
    startDate: string
    endDate?: string
    isCurrent: boolean
  }
}> = ({ onSuccess, existing }) => {
  const schema = z
    .object({
      title: z.string().min(1, 'Title is required'),
      companyName: z.string().min(1, 'Company name is required'),
      startDate: z
        .string()
        .refine((value) => value !== '', { message: 'Start date is required' }),
      endDate: z.string().nullable(),
      isCurrent: z.boolean(),
    })
    .refine(
      (data) =>
        (data.isCurrent && !data.endDate) || (!data.isCurrent && data.endDate),
      {
        message:
          'Please fill the end date if you are not working at this company anymore.',
        path: ['endDate'],
      }
    )
    .transform((data) => ({
      ...data,
      endDate: data.isCurrent ? null : data.endDate,
    }))

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existing?.title ?? '',
      companyName: existing?.companyName ?? '',
      startDate: existing?.startDate
        ? dayjs(existing?.startDate).format('YYYY-MM')
        : '',
      endDate: existing?.endDate
        ? dayjs(existing?.endDate).format('YYYY-MM')
        : '',
      isCurrent: existing?.isCurrent ?? false,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setIsLoading(true)
      await axios(`/job-experience`, {
        method: existing?.id ? 'PUT' : 'POST',
        data: {
          id: existing?.id,
          ...data,
        },
      })

      onSuccess?.()
      form.reset()
      toast.success(existing?.id ? "Job experience updated" : "New job experience added")
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
      {form.formState.errors?.root?.message && (
        <div>
          <p className="text-xs text-error">
            {form.formState.errors?.root?.message}
          </p>
        </div>
      )}

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Title</span>
        </div>
        <input
          type="text"
          placeholder="example: Network Administrator"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('title', { required: true })}
        />
        {form.formState.errors.title?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.title.message}
            </div>
          </div>
        )}
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Company name</span>
        </div>
        <input
          type="text"
          placeholder="example: Greenfields"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('companyName', { required: true })}
        />
        {form.formState.errors.companyName?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.companyName.message}
            </div>
          </div>
        )}
      </label>

      <label className="form-control max-w-xs">
        <div className="label">
          <span className="label-text">Start date</span>
        </div>
        <input
          type="month"
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('startDate', { required: true })}
        />
        {form.formState.errors.startDate?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.startDate.message}
            </div>
          </div>
        )}
      </label>

      <label className="form-control max-w-xs">
        <div className="label">
          <span className="label-text">End date</span>
        </div>
        <input
          type="month"
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          disabled={form.watch('isCurrent') || isLoading}
          {...form.register('endDate', { required: true })}
        />
        {form.formState.errors.endDate?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.endDate.message}
            </div>
          </div>
        )}
      </label>

      <div className="form-control mt-2">
        <label className="cursor-pointer label">
          <span className="label-text">Still working in this company</span>
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            disabled={isLoading}
            {...form.register('isCurrent')}
          />
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

export default FormJobExperiences
