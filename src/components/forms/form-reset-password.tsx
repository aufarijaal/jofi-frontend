import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from '@/lib/axios'
import { toast } from 'sonner'

const FormResetPassword: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setConfirmShowPass] = useState(false)

  const schema = z
    .object({
      currentPassword: z.string().min(1, 'Current Password is required'),
      newPassword: z.string().min(3, 'New Password is required'),
      confirmPassword: z.string().min(3, 'Password Confirmation is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Password does not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const [isLoading, setIsloading] = useState(false)

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setIsloading(true)
      await axios.put(`/account/settings/password-reset`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      onSuccess?.()
      form.reset()
      toast.success("Password reset successfully")
    } catch (error) {
      if (error instanceof AxiosError) {
        form.setError('root', {
          message: error.response?.data.message,
        })
        toast.error(error.response?.data.message)
      }
    } finally {
      setIsloading(false)
    }
  }
  return (
    <form
      id="form-reset-account-password"
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-sm flex flex-col gap-2"
    >
      <div>
        <h4 className="text-lg font-semibold">Reset password</h4>
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
          <span className="label-text">Current Password</span>
        </div>
        <input
          type={showCurrentPass ? 'text' : 'password'}
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('currentPassword', { required: true })}
        />
        <div className="flex items-center gap-2">
          <div className="label">
            {form.formState.errors.currentPassword?.message && (
              <div className="label-text-alt text-error">
                {form.formState.errors.currentPassword.message}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                onChange={(e) => setShowCurrentPass(e.target.checked)}
              />
              <span className="label-text text-xs">Show</span>
            </div>
          </div>
        </div>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">New Password</span>
        </div>
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('newPassword', { required: true })}
        />
        <div className="flex items-center gap-2">
          <div className="label">
            {form.formState.errors.newPassword?.message && (
              <div className="label-text-alt text-error">
                {form.formState.errors.newPassword.message}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                onChange={(e) => setShowPass(e.target.checked)}
              />
              <span className="label-text text-xs">Show</span>
            </div>
          </div>
        </div>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Confirm Password</span>
        </div>
        <input
          type={showConfirmPass ? 'text' : 'password'}
          placeholder="Type here"
          className="input input-bordered w-full input-sm"
          disabled={isLoading}
          {...form.register('confirmPassword', { required: true })}
        />
        <div className="flex items-center gap-2">
          <div className="label">
            {form.formState.errors.confirmPassword?.message && (
              <div className="label-text-alt text-error">
                {form.formState.errors.confirmPassword.message}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                onChange={(e) => setConfirmShowPass(e.target.checked)}
              />
              <span className="label-text text-xs">Show</span>
            </div>
          </div>
        </div>
      </label>

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

export default FormResetPassword
