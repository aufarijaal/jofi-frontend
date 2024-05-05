import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import ThemeSwitch from '../theme-switch'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from 'next-themes'

function EmployerNavbar() {
  const router = useRouter()
  const auth = useAuthContext()
  const { theme } = useTheme()

  const menu = [
    {
      url: '/employer/dashboard/applications',
      text: 'Applications',
      icon: (
        <Icon icon="mdi:note" width="24" height="24" className="text-warning" />
      ),
    },
    {
      url: '/employer/dashboard/job-posts',
      text: 'Job Posts',
      icon: (
        <Icon
          icon="mdi:briefcase-variant-outline"
          width="24"
          height="24"
          className="text-primary"
        />
      ),
    },
  ]
  const [showManagements, setshowManagements] = useState(false)

  return (
    <div className="navbar fixed top-0 left-0 bg-base-100 shadow-sm z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-max"
          >
            <li>
              <Link
                href="/employer/dashboard"
                className={`${
                  router.pathname === '/employer/dashbord' ? 'active' : ''
                }`}
              >
                <Icon
                  icon="mdi:home"
                  width="24"
                  height="24"
                  className="text-secondary"
                />
                Home
              </Link>
            </li>
            <li>
              <span
                className={`menu-dropdown-toggle ${
                  showManagements && 'menu-dropdown-show'
                }`}
                onClick={() => setshowManagements(!showManagements)}
              >
                <Icon
                  icon="mdi:database-cog-outline"
                  width="24"
                  height="24"
                  className="text-base-content"
                />
                <h4>Managements</h4>
              </span>
              <ul
                className={`menu-dropdown mt-1 ${
                  showManagements && 'menu-dropdown-show'
                }`}
              >
                {menu.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.url}
                      className={`${
                        router.pathname === item.url ? 'active' : ''
                      }`}
                    >
                      {item.icon}
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/employer/dashboard" className="btn btn-ghost text-xl">
          <img
            className="h-[30px]"
            src={
              theme === 'corporate' ? '/favicon-light.svg' : '/favicon-dark.svg'
            }
            alt="jofi logo"
          />
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Icon icon="material-symbols:person" width="24" height="24" />
              </div>
            </button>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box min-w-[150px]"
          >
            <li>
              <ThemeSwitch variant="dropdown-button" />
            </li>
            <li>
              <button
                onClick={() => {
                  auth?.signOut(() => {
                    router.push('/employer/auth/signin')
                  })
                }}
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmployerNavbar
