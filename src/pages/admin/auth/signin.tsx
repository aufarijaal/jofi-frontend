import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

function AdminSigninPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)

  const schema = z.object({
    username: z.string().trim().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      const result = await axios.post(`/admin/auth/signin`, data)

      if (result.status === 200) {
        router.push(`/admin/dashboard`)
      }
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        form.setError('root', { message: error.response?.data.message })
      }
    }
  }
  return (
    <main className="min-h-screen w-full px-4 max-w-7xl mx-auto grid place-items-center">
      <Head>
        <title>Admin Sign in | JoFi</title>
      </Head>

      <div className="card bg-base-100 shadow-xl md:w-[600px] w-full max-w-sm">
        <div className="card-body">
          <div className="my-6 flex flex-col gap-4">
            <Link
              href="/"
              className="font-extrabold text-3xl text-center block"
            >
              JF
            </Link>
            <h3 className="text-xl text-center">ADMIN SIGN IN</h3>
          </div>

          <div className="text-center w-full">
            {form.formState.errors.root?.message && (
              <p className="text-error">
                {form.formState.errors.root?.message}
              </p>
            )}
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...form.register('username', { required: true })}
              />
              {form.formState.errors.username?.message && (
                <div className="label">
                  <div className="label-text-alt text-error">
                    {form.formState.errors.username.message}
                  </div>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...form.register('password', { required: true })}
              />
              <div className="label">
                {form.formState.errors.password?.message && (
                  <div className="label-text-alt text-error">
                    {form.formState.errors.password.message}
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
            </label>

            <button className="btn btn-error btn-sm mt-4" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminSigninPage
