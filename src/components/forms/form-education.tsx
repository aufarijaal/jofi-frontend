import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { toast } from 'sonner'

const FormEducation: React.FC<{
  onSuccess?: () => void
  existing?: {
    id: number
    level: string
    institution: string
    major: string
    startDate: string
    endDate?: string
    isCurrent: boolean
  }
}> = ({ onSuccess, existing }) => {
  const schema = z
    .object({
      level: z.string(),
      major: z.string().min(1, { message: 'Major is required' }),
      institution: z.string().min(1, { message: 'Institution is required' }),
      startDate: z
        .string()
        .refine((value) => value !== '', { message: 'Start date is required' }),
      endDate: z.string().nullable(),
      isCurrent: z.boolean(),
    })
    .transform((data) => ({
      ...data,
      endDate: data.isCurrent ? null : data.endDate,
    }))
    .refine((data) => data.level && data.level !== '', {
      message: 'Please select the education level',
      path: ['level'],
    })
    .refine(
      (data) =>
        (data.isCurrent && !data.endDate) || (!data.isCurrent && data.endDate),
      {
        message: 'Please fill the end date if you are already graduated.',
        path: ['endDate'],
      }
    )

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      level: existing?.level ?? '',
      major: existing?.major ?? '',
      institution: existing?.institution ?? '',
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
      await axios(`/education`, {
        method: existing?.id ? 'PUT' : 'POST',
        data: {
          id: existing?.id,
          ...data,
        },
      })

      toast.success(
        existing?.id ? 'Educations updated' : 'New education item added',
        {
          onAutoClose: (t) => {
            window.location.reload()
          },
        }
      )
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
          <span className="label-text">Major</span>
        </div>
        <input
          type="text"
          placeholder="example: Computer Science"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('major', { required: true })}
        />
        {form.formState.errors.major?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.major.message}
            </div>
          </div>
        )}
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Institution</span>
        </div>
        <input
          type="text"
          placeholder="example: Oxford University"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('institution', { required: true })}
        />
        {form.formState.errors.institution?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.institution.message}
            </div>
          </div>
        )}
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Level</span>
        </div>
        <select
          className="select select-sm select-bordered w-full"
          disabled={isLoading}
          defaultValue={''}
          {...form.register('level', { required: true })}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="D1">D1</option>
          <option value="D2">D2</option>
          <option value="D3">D3</option>
          <option value="D4">D4</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>

        {form.formState.errors.level?.message && (
          <div className="label">
            <div className="label-text-alt text-error">
              {form.formState.errors.level.message}
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
          <span className="label-text">On going</span>
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

export default FormEducation
