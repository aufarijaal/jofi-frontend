import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import axios from '@/lib/axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CompanyForSelect, UserWithName } from '@/types'

const DialogEditUser: React.FC<{
  dialogId: string
  onSuccess: () => void
  onClose: (btnClose: RefObject<HTMLButtonElement>) => void
  existingData?: {
    id: number
    name: string
    email: string
    companyId: number | null
    isEmployer: boolean
  }
}> = ({ dialogId, onSuccess, existingData, onClose }) => {
  const schema = z
    .object({
      name: z.string().trim().min(1, 'Name is required'),
      email: z.string().trim().email(),
      isEmployer: z.boolean(),
      companyId: z.nullable(z.number()).transform((v) => (v === -1 ? null : v)),
    })
    .refine(
      (input) => {
        if (input.isEmployer && !input.companyId) return false

        return true
      },
      { message: 'Company is required if set to employer', path: ['companyId'] }
    )

  const formId = useMemo(() => 'form-edit-user', [])
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
      email: existingData?.email ?? '',
      companyId: existingData?.companyId ?? -1,
      isEmployer: existingData?.isEmployer ?? false,
    },
  })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [companies, setCompanies] = useState<CompanyForSelect[]>()

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      if (!existingData) {
        return alert('Invalid Id')
      }

      await axios.put(`/users/${existingData?.id}`, data)
      onSuccess()
      onClose(btnClose)
    } catch (error: any) {
      console.error(error)

      setError('root', error.message)
    }
  }

  async function getCompanies() {
    try {
      const result = await axios.get('/companies/for-select')

      setCompanies(result.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [])

  return (
    <dialog id={dialogId} className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit user</h3>
        {errors.root && (
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

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="Type here"
                className="input input-bordered input-sm w-full"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Company</span>
              </div>
              <select
                className="select select-bordered w-full select-sm"
                {...register('companyId', {
                  valueAsNumber: true,
                })}
                defaultValue={-1}
              >
                <option value={-1} className="text-secondary">
                  -
                </option>
                {companies?.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.companyId.message}
                  </span>
                </div>
              )}
            </label>

            <div className="form-control mt-2">
              <label className="cursor-pointer label">
                <span className="label-text">Set as employer</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  {...register('isEmployer')}
                />
              </label>
            </div>
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
            disabled={isSubmitting || !isDirty}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DialogEditUser
