import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from '@/lib/axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CompanyForSelect } from '@/types'
import { AxiosError } from 'axios'

const DialogAddUpdateJobCategory: React.FC<{
  dialogId: string
  onSuccess: () => void
  existingData?: {
    id: number
    name: string
  }
  onClose: () => void
}> = ({ dialogId, onSuccess, existingData, onClose }) => {
  const schema = z.object({
    name: z.string().trim().min(1, 'Cannot be empty'),
  })
  const formId = useMemo(() => 'form-add-update-job-category', [])
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
    defaultValues: {
      name: '',
    },
    values: {
      name: existingData?.name ?? '',
    },
  })
  const dialogRef = useRef<HTMLDialogElement>(null)

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      existingData && existingData.id
        ? await axios.put(`/job-categories/${existingData.id}`, {
            id: existingData.id,
            name: data.name,
          })
        : await axios.post(`/job-categories`, {
            name: data.name,
          })
      onSuccess()
      btnClose.current?.click()
      onClose()
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setError('root', {
          message: error.response?.data.message,
        })
      }
    }
  }

  return (
    <dialog id={dialogId} className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {existingData ? 'Edit job category' : 'Add new job category'}
        </h3>
        {errors.root?.message && (
          <p className="text-error text-xs">{errors.root.message}</p>
        )}
        <div>
          <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
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
          </form>
        </div>

        <div className="modal-action flex gap-1">
          <form method="dialog">
            <button
              className="btn btn-sm"
              ref={btnClose}
              onClick={() => {
                reset()
                onClose()
              }}
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

export default DialogAddUpdateJobCategory
