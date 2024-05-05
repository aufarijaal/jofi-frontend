import axios from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { JobCategory, JobPostForEmployer } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const FormEditJobPost: React.FC<{
  onSuccess?: (data: any) => void
  formId: string
  existingData: JobPostForEmployer
}> = ({ onSuccess, formId, existingData }) => {
  const [jobCategories, setJobCategories] = useState<JobCategory[]>()

  const schema = z.object({
    jobCategoryId: z.number().gt(0, { message: 'Job category is required' }),
    title: z.string().trim(),
    description: z.string().trim(),
    requirements: z.array(
      z.object({
        requirement: z
          .string()
          .trim()
          .min(1)
          .refine((value) => !value.includes('~'), {
            message: "Cannot contain '~'",
          }),
      })
    ),
    salary: z
      .number({
        errorMap: (issue, ctx) => ({
          message: 'Salary must be type of number',
        }),
      })
      .gt(0, { message: 'Salary cannot be zero' }),
    location: z.string().trim(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const requirementsInputArray = useFieldArray({
    control: form.control,
    name: 'requirements',
  })

  async function getJobCategories() {
    try {
      const result = await axios.get('/job-categories')

      setJobCategories(result.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  async function submit(data: any) {
    try {
      if (!form.formState.isDirty) {
        return form.setError('root', {
          message: 'You are not changing anything, You can close this dialog.',
        })
      }
      await axios.put(`/jobs/${existingData.id}`, data)
      onSuccess?.(data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    getJobCategories().then(() => {
      form.reset({
        title: existingData.title,
        description: existingData.description,
        jobCategoryId: existingData.jobCategoryId,
        location: existingData.location,
        salary: parseInt(existingData.salary),
        requirements: existingData.requirements
          .split('~')
          .map((r) => ({ requirement: r })),
      })
    })

    return () => {}
  }, [])

  return (
    <form
      className="flex flex-col gap-2 mt-4"
      onSubmit={form.handleSubmit(submit)}
      id={formId}
    >
      {form.formState.isDirty ? 'true' : 'false'}
      {form.formState.errors.root && (
        <div className="root-error">
          <p className="text-xs text-error">
            {form.formState.errors.root.message}
          </p>
        </div>
      )}

      {/* Title */}
      <label className="form-control w-full">
        <div className="label">
          <div className="label-text">Title</div>
        </div>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full select-sm"
          {...form.register('title', { required: true })}
        />
        {form.formState.errors.title && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.title?.message}
            </span>
          </div>
        )}
      </label>

      {/* Job category */}
      <label className="form-control w-full">
        <div className="label">
          <div className="label-text">Job Category</div>
        </div>
        <select
          className="select select-sm select-bordered w-full"
          defaultValue={existingData.jobCategoryId}
          {...form.register('jobCategoryId', {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option disabled value={-1}>
            Select an option
          </option>
          {jobCategories?.map((category) => (
            <option value={category.id} title={category.slug} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {form.formState.errors.jobCategoryId && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.jobCategoryId?.message}
            </span>
          </div>
        )}
      </label>

      {/* Description */}
      <label className="form-control w-full">
        <div className="label">
          <div className="label-text">Description</div>
        </div>
        <textarea
          className="textarea textarea-sm textarea-bordered"
          placeholder="Type here"
          {...form.register('description', { required: true })}
        ></textarea>
        {form.formState.errors.description && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.description?.message}
            </span>
          </div>
        )}
      </label>

      {/* Salary */}
      <label className="form-control w-full">
        <div className="label">
          <div className="label-text">Salary</div>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-sm input-bordered w-full"
          {...form.register('salary', { required: true, valueAsNumber: true })}
        />
        {form.formState.errors.salary && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.salary?.message}
            </span>
          </div>
        )}
      </label>

      {/* Job location */}
      <label className="form-control w-full">
        <div className="label">
          <div className="label-text">Location</div>
        </div>
        <input
          type="text"
          placeholder="Jakarta, Indonesia"
          className="input input-sm input-bordered w-full"
          {...form.register('location', { required: true })}
        />
        {form.formState.errors.location && (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.location?.message}
            </span>
          </div>
        )}
      </label>

      <div className="divider my-0"></div>

      {/* Job requirements */}
      <div id="input-requirements">
        <div className="mb-4 space-y-2">
          <div className="font-bold">Requirements</div>
        </div>

        <div className={`flex flex-col gap-2 requirement-list`}>
          {requirementsInputArray.fields.map((field, index) => (
            <div
              className={`flex gap-2 items-start requirement-list-item`}
              key={field.id}
            >
              <label className="form-control w-full">
                <input
                  type="text"
                  placeholder="Type here"
                  {...form.register(
                    `requirements.${index}.requirement` as const,
                    {
                      required: true,
                    }
                  )}
                  className="input input-bordered input-sm w-full"
                />
                {form.formState.errors?.requirements?.[index]?.requirement && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {
                        form.formState.errors?.requirements?.[index]
                          ?.requirement?.message
                      }
                    </span>
                  </div>
                )}
              </label>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => requirementsInputArray.remove(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}

          <button
            className="btn btn-sm mt-4 w-full"
            onClick={() => requirementsInputArray.append({ requirement: '' })}
          >
            Add more requirement
          </button>
        </div>
      </div>
    </form>
  )
}

export default FormEditJobPost
