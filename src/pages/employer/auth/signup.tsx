import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useForm } from 'react-hook-form'
import { CompanyForSelect } from '@/types'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function EmployerSignupPage() {
  const schema = z
    .object({
      name: z.string().trim().min(1, 'Name is required'),
      email: z.string().email().trim().min(1, 'Email is required'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
      companyId: z.number().gt(0, { message: 'Company is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password does not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const [companies, setCompanies] = useState<CompanyForSelect[]>()
  const [loading, setLoading] = useState(false)
  const [loadingCompany, setLoadingCompany] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [signUpResultMessage, setSignUpResultMessage] = useState("")

  async function getCompanies() {
    try {
      setLoadingCompany(true)
      const result = await axios.get('/companies/for-select')

      setCompanies(result.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingCompany(false)
    }
  }

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setLoading(true)
      const result = await axios.post('/employers/auth/signup', data)

      setSignUpResultMessage(result.data.message)
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        form.setError('root', {
          message: error.response?.data.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [])
  return (
    <main className="min-h-screen w-full px-4 max-w-7xl mx-auto grid place-items-center">
      <Head>
        <title>Employer Sign up | JoFi</title>
      </Head>

      <div className="card bg-base-100 shadow-xl md:w-[600px] w-full">
        <div className="card-body">
          <div className="my-6 flex flex-col gap-4">
            <Link
              href="/"
              className="font-extrabold text-3xl text-center block"
            >
              JF
            </Link>
            <h3 className="text-xl text-center">EMPLOYER SIGN UP</h3>

            <div className="text-center w-full">
              {form.formState.errors.root?.message && (
                <p className="text-error">
                  {form.formState.errors.root?.message}
                </p>
              )}
            </div>

            <div className="text-center w-full">
              {signUpResultMessage && (
                <p className="text-warning">
                  {signUpResultMessage}
                </p>
              )}
            </div>
          </div>

          <form
            className="grid lg:grid-rows-[repeat(3, minmax(0, max-content))] lg:grid-cols-2 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...form.register('name', { required: true })}
              />
              {form.formState.errors.name && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.name?.message}
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
                className="input input-bordered w-full input-sm"
                {...form.register('email', { required: true })}
              />
              {form.formState.errors.email && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.email?.message}
                  </span>
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
                {form.formState.errors.password ? (
                  <span className="label-text-alt text-error">
                    {form.formState.errors.password?.message}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      tabIndex={-1}
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      onChange={(e) => setShowPass(e.target.checked)}
                    />
                    <span className="label-text text-xs">Show</span>
                  </div>
                )}
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
                {...form.register('confirmPassword', { required: true })}
              />
              <div className="label">
                {form.formState.errors.confirmPassword ? (
                  <span className="label-text-alt text-error">
                    {form.formState.errors.confirmPassword?.message}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      tabIndex={-1}
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      onChange={(e) => setShowConfirmPass(e.target.checked)}
                    />
                    <span className="label-text text-xs">Show</span>
                  </div>
                )}
              </div>
            </label>

            <label className="form-control w-full md:col-span-2">
              <div className="label">
                <span className="label-text">Company</span>
              </div>
              {loadingCompany ? (
                <div className="skeleton h-[32px] w-full"></div>
              ) : (
                <select
                  className="select select-bordered w-full select-sm"
                  defaultValue={-1}
                  {...form.register('companyId', {
                    required: true,
                    valueAsNumber: true,
                  })}
                >
                  <option disabled value={-1}>
                    Select One
                  </option>
                  {companies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
              {form.formState.errors.companyId && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.companyId?.message}
                  </span>
                </div>
              )}
            </label>

            <button
              className="btn btn-accent btn-sm col-span-2 mt-4"
              type="submit"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              {loading ? 'Submitting' : 'Submit'}
            </button>

            <div className="text-center col-span-2 flex flex-col gap-2 mt-4">
              <div className="text-xs">
                Already have an account?{' '}
                <Link
                  href="/employer/auth/signin"
                  className="link link-hover font-bold"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-xs">
                Or sign up as{' '}
                <Link href="/auth/signup" className="link link-hover font-bold">
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

export default EmployerSignupPage
