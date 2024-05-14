import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ThemeSwitch from '../theme-switch'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from 'next-themes'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Modal, ModalToggler, useModal } from '@faceless-ui/modal'
import axios from '@/lib/axios'

function Footer() {
  const auth = useAuthContext()
  const { theme } = useTheme()

  const feedbackMessageMaxLength = 1_000
  const feedbackModalSlug = 'feedback-modal'

  const schema = z.object({
    rate: z.number().min(1).max(5),
    message: z.string().max(feedbackMessageMaxLength),
  })

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      rate: 5,
      message: 'JoFi makes my job finding felt so easy! Thanks!',
    },
  })

  const [loading, setloading] = useState(false)
  const [rateValue, setRateValue] = useState(5)
  const { toggleModal } = useModal()
  const emojis = [
    {
      static:
        'https://fonts.gstatic.com/s/e/notoemoji/latest/2639_fe0f/emoji.svg',
      anim: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2639_fe0f/512.webp',
      text: 'Terrible',
    },
    {
      static: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae4/emoji.svg',
      anim: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae4/512.webp',
      text: 'Bad',
    },
    {
      static: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/emoji.svg',
      anim: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp',
      text: 'Okay',
    },
    {
      static: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/emoji.svg',
      anim: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.webp',
      text: 'Good',
    },
    {
      static: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/emoji.svg',
      anim: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.webp',
      text: 'Great',
    },
  ]

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setloading(true)

      await axios.post('/rates', data)
      toggleModal(feedbackModalSlug)
    } catch (error) {
      if (error instanceof AxiosError) {
        form.setError('root', error.response?.data.message)
        toast.error(error.response?.data.message)
      }
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'rate') {
        setRateValue(value.rate as number)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <Modal slug={feedbackModalSlug} className="modal-box">
        <div className="feedback-form-container">
          <h3 className="text-xl font-bold">Give feedback</h3>
          <form
            className="flex flex-col gap-4"
            id="feedback-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="feedback-form__rate flex gap-6 w-full justify-center py-4">
              {emojis.map((v, i) => (
                <label
                  htmlFor={`rate-${i + 1}`}
                  key={i + 1}
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <input
                    className="peer"
                    hidden
                    type="radio"
                    role="radio"
                    id={`rate-${i + 1}`}
                    {...form.register('rate', {
                      valueAsNumber: true,
                      required: true,
                    })}
                    value={i + 1}
                  />
                  <img
                    className="peer-checked:block hidden"
                    width="48"
                    src={v.anim}
                    alt="emot"
                  />
                  <img
                    className="peer-checked:hidden grayscale"
                    width="48"
                    src={v.static}
                    alt="emot"
                  />
                  <div className="text-sm">{v.text}</div>
                </label>
              ))}
            </div>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Your thoughts</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24 text-sm"
                placeholder="Feedback message"
                {...form.register('message', { required: false })}
              ></textarea>
              <div className="label">
                <span className="label-text-alt text-error">
                  {form.formState.errors.rate?.message}
                </span>
                <span className="label-text-alt">
                  {form.watch('message').length} / {feedbackMessageMaxLength}
                </span>
              </div>
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm"
                type="button"
                onClick={() => toggleModal(feedbackModalSlug)}
              >
                Cancel
              </button>
              <button className="btn btn-accent btn-sm" disabled={loading}>
                {loading && <span className="loading loading-spinner"></span>}
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <nav className="grid grid-flow-col gap-4">
        <Link href="/companies" className="link link-hover">
          Companies
        </Link>
        <Link href="/" className="link link-hover">
          Jobs
        </Link>
        {!auth?.user && (
          <Link href="/auth/signup" className="link link-hover">
            Sign up
          </Link>
        )}
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link href="/" className="font-extrabold">
            <img
              className="h-[42px]"
              src={
                theme === 'corporate'
                  ? '/favicon-light.svg'
                  : '/favicon-dark.svg'
              }
              alt="jofi logo"
            />{' '}
          </Link>
        </div>
      </nav>
      <div>
        <ThemeSwitch />
      </div>

      {auth?.user && (
        <div>
          <ModalToggler slug={feedbackModalSlug}>Give feedback</ModalToggler>
        </div>
      )}
      <aside>
        <p>
          Copyright © 2024 - All right reserved by <strong>JoFi</strong>
        </p>
      </aside>
    </footer>
  )
}

export default Footer
