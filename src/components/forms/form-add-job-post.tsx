import jobCategories from '@/pages/admin/dashboard/job-categories'
import { fields } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js'
import axios from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { JobCategory } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'

const FormAddJobPost: React.FC<{
  onSuccess?: (data: any) => void
  formId: string
}> = ({ onSuccess, formId }) => {
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
    salary: z.number({
      errorMap: (issue, ctx) => ({
        message: 'Salary must be type of number',
      }),
    }),
    location: z.string().trim(),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      requirements: [{ requirement: 'Communication skill' }],
      salary: 0,
      active: true,
    },
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
      await axios.post(`/jobs`, data)
      onSuccess?.(data)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    getJobCategories()
  }, [])

  return (
    <form
      className="flex flex-col gap-2 mt-4"
      onSubmit={form.handleSubmit(submit)}
      id={formId}
    >
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
          defaultValue={-1}
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
      <div className="form-control w-full">
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
      </div>

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

      <div className="form-control mt-2">
        <label className="cursor-pointer label">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            {...form.register('active')}
          />
        </label>
      </div>

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

export default FormAddJobPost
