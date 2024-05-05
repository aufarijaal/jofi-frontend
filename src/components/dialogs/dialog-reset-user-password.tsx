import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from '@/lib/axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const DialogResetUserPassword: React.FC<{
  dialogId: string
  userId: number
  onSuccess: () => void
}> = ({ dialogId, onSuccess, userId }) => {
  const schema = z.object({
    password: z.string().min(3, 'Password must have at least 3 characters'),
  })

  const formId = useMemo(() => 'form-reset-user-password', [])
  const btnClose = useRef<HTMLButtonElement>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const dialogRef = useRef<HTMLDialogElement>(null)

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      await axios.put('/admin/reset-user-password', {
        id: userId,
        password: data.password,
      })
      onSuccess()
      btnClose.current?.click()
    } catch (error: any) {
      console.error(error)

      setError('root', error.message)
    }
  }

  return (
    <dialog id={dialogId} className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reset user password</h3>
        {errors.root && (
          <p className="text-error text-xs">{errors.root.message}</p>
        )}
        <div>
          <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="Type here"
                className="input input-bordered input-sm w-full"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
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
              }}
            >
              Close
            </button>
          </form>

          <button
            className="btn btn-primary btn-sm"
            form={formId}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DialogResetUserPassword
