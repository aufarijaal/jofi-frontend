import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useForm } from 'react-hook-form'
import { CompanyForSelect } from '@/types'

function EmployerSignupPage() {
  const { register, handleSubmit } = useForm<{
    name: string
    email: string
    password: string
    confirmPassword: string
    companyId: number
  }>()
  const [companies, setCompanies] = useState<CompanyForSelect[]>()

  async function getCompanies() {
    try {
      const result = await axios.get('/companies/for-select')

      setCompanies(result.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  async function onSubmit() {
    try {
      await axios.post('/employer/auth/signup')
    } catch (error) {
      console.error(error)
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

      <div className="card bg-base-100 shadow-xl md:w-[600px] w-full max-w-md">
        <div className="card-body">
          <div className="my-6 flex flex-col gap-4">
            <Link
              href="/"
              className="font-extrabold text-3xl text-center block"
            >
              JF
            </Link>
            <h3 className="text-xl text-center">EMPLOYER SIGN UP</h3>
          </div>

          <form
            className="grid lg:grid-rows-[repeat(3, minmax(0, max-content))] lg:grid-cols-2 gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...register('name', { required: true })}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
                {...register('email', { required: true })}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
              />
              <div className="label">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-xs"
                  />
                  <span className="label-text text-xs">Show</span>
                </div>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Confirm Password</span>
              </div>
              <input
                type="password"
                placeholder="Type here"
                className="input input-bordered w-full input-sm"
              />
              <div className="label">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-xs"
                  />
                  <span className="label-text text-xs">Show</span>
                </div>
              </div>
            </label>

            <label className="form-control w-full md:col-span-2">
              <div className="label">
                <span className="label-text">Company</span>
              </div>
              <select className="select select-bordered w-full select-sm">
                <option disabled selected>
                  Select One
                </option>
                {companies?.map((company) => (
                  <option key={company.id}>{company.name}</option>
                ))}
              </select>
            </label>

            <button className="btn btn-accent btn-sm col-span-2 mt-4">
              Submit
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
