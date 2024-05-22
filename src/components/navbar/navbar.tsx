import { useAuthContext } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ThemeSwitch from '../theme-switch'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { useTheme } from 'next-themes'

function Navbar() {
  const router = useRouter()
  const isActive = (href: string) => router.pathname === href
  const auth = useAuthContext()
  const {theme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  })

  return (
    <nav className="navbar fixed top-0 left-0 bg-base-100 shadow-lg z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex-1 flex items-center">
          <Link href="/" className="block px-4">
            {mounted && <img className="h-[30px]" src={theme === 'corporate' ? "/favicon-light.svg" : "/favicon-dark.svg"} alt="jofi logo" />}
          </Link>
          <ul className="menu menu-horizontal px-1">
            {['/employer'].every(
              (route) => !router.pathname.includes(route)
            ) && (
              <>
                <li>
                  <Link href="/">Jobs</Link>
                </li>
                <li>
                  <Link href="/companies">Companies</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="flex-none">
          {auth?.isLoading ? (
            <div className="w-[48px] h-[48px] rounded-full skeleton"></div>
          ) : !auth?.user ? (
            <>
              <ul className="menu menu-horizontal px-1 flex gap-2 items-center">
                <li>
                  <Link href="/auth/signin">Sign in</Link>
                </li>
                <li>
                  <Link href="/auth/signup">Sign up</Link>
                </li>
              </ul>
            </>
          ) : (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
                >
                  <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <Icon
                        icon="material-symbols:person"
                        width="24"
                        height="24"
                      />
                    </div>
                  </button>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box min-w-[150px]"
                >
                  <div className="p-2 pb-0 text-xs text-center">
                    {auth.user.email}
                  </div>
                  <div className="divider my-1"></div>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li>
                    <ThemeSwitch variant="dropdown-button" />
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        auth.signOut(() => {
                          router.push('/auth/signin')
                        })
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
