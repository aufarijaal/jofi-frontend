import React, { RefObject, useMemo, useRef } from 'react'
import axios from '@/lib/axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Company } from '@/types'
import { AxiosError } from 'axios'

const DialogEditCompany: React.FC<{
  dialogId: string
  onSuccess: () => void
  existingData?: Company
  onClose: () => void
}> = ({ dialogId, onSuccess, existingData, onClose }) => {
  const schema = z.object({
    name: z.string().trim().min(1, 'Company name is required'),
    location: z.string().trim().min(1, 'Location is required'),
    industry: z.string().trim().min(1, 'Industry is required'),
    about: z.string().trim().nullable(),
  })

  const formId = useMemo(() => 'form-edit-company', [])
  const btnClose = useRef<HTMLButtonElement>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      name: existingData?.name ?? '',
      industry: existingData?.industry ?? '',
      about: existingData?.about ?? '',
      location: existingData?.location ?? '',
    },
  })
  const dialogRef = useRef<HTMLDialogElement>(null)

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      await axios.put(`/companies/${existingData?.id}`, data)
      onSuccess()
      btnClose.current?.click()
      onClose()
      reset()
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setError('root', {
          message: error.response?.data.message,
        })
      }

      console.error(error)
    }
  }

  return (
    <dialog id={dialogId} className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit company</h3>
        {errors.root && (
          <p className="text-error text-xs">{errors.root.message}</p>
        )}
        <div>
          <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Company name</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-sm w-full"
                {...register('name', { required: true })}
              />

              {errors.name && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Location</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-sm w-full"
                {...register('location', { required: true })}
              />
              {errors.location && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.location.message}
                  </span>
                </div>
              )}
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="About"
                {...register('about')}
                maxLength={200}
              ></textarea>
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.about?.message}
                </span>
                <span className="label-text-alt text-secondary">
                  {watch('about')?.length} / 200
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Industry</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-sm w-full"
                {...register('industry', { required: true })}
              />
              {errors.industry && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.industry.message}
                  </span>
                </div>
              )}
            </label>
          </form>
        </div>

        <div className="modal-action flex gap-1">
          <form method="dialog">
            <button
              className="btn btn-sm"
              ref={btnClose}
              onClick={() => onClose()}
            >
              Close
            </button>
          </form>

          <button
            className="btn btn-primary btn-sm"
            form={formId}
            disabled={isSubmitting || !isDirty}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DialogEditCompany
