import Link from 'next/link'
import React from 'react'
import ThemeSwitch from '../theme-switch'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from 'next-themes'

function Footer() {
  const auth = useAuthContext()
  const { theme } = useTheme()

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
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
      <aside>
        <p>
          Copyright © 2024 - All right reserved by <strong>JoFi</strong>
        </p>
      </aside>
    </footer>
  )
}

export default Footer
