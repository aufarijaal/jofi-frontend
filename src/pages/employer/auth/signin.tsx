import { useAuthContext } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

function EmployerSigninPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const auth = useAuthContext()

  const schema = z.object({
    email: z.string().email().trim().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      await auth?.employerSignIn({ email: data.email, password: data.password })

      router.push(`/employer/dashboard`)
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
        <title>Employer Sign in | JoFi</title>
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
            <h3 className="text-xl text-center">EMPLOYER SIGN IN</h3>

            <div className="text-center w-full">
              {form.formState.errors.root?.message && (
                <p className="text-error">
                  {form.formState.errors.root?.message}
                </p>
              )}
            </div>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...form.register('email', { required: true })}
              />
              {form.formState.errors.email?.message && (
                <div className="label">
                  <div className="label-text-alt text-error">
                    {form.formState.errors.email.message}
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
              <div className="flex items-center gap-2">
                <div className="label">
                  {form.formState.errors.password?.message ? (
                    <div className="label-text-alt text-error">
                      {form.formState.errors.password.message}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        onChange={(e) => setShowPass(e.target.checked)}
                      />
                      <span className="label-text text-xs">Show</span>
                    </div>
                  )}
                </div>
              </div>
            </label>

            <button className="btn btn-primary btn-sm mt-4" type="submit">
              Submit
            </button>

            <div className="flex flex-col gap-2 items-center mt-4">
              <div className="text-xs">
                Don't have an account?{' '}
                <Link
                  href="/employer/auth/signup"
                  className="link link-hover font-bold"
                >
                  Sign up
                </Link>
              </div>

              <div className="text-xs">
                Or sign in as{' '}
                <Link href="/auth/signin" className="link link-hover font-bold">
                  Job seeker
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default EmployerSigninPage
