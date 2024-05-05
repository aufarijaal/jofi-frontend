import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import ThemeSwitch from '../theme-switch'
import { useAuthContext } from '@/context/AuthContext'

function AdminNavbar() {
  const router = useRouter()
  const auth = useAuthContext()
  const menu = [
    {
      url: '/admin/dashboard/companies',
      text: 'Companies',
      icon: (
        <Icon
          icon="mdi:office-building"
          width="24"
          height="24"
          className="text-success"
        />
      ),
    },
    {
      url: '/admin/dashboard/employer-requests',
      text: 'Employer Requests',
      icon: (
        <Icon
          icon="mdi:account-alert"
          width="24"
          height="24"
          className="text-error"
        />
      ),
    },
    {
      url: '/admin/dashboard/job-categories',
      text: 'Job Categories',
      icon: (
        <Icon
          icon="mdi:shape-outline"
          width="24"
          height="24"
          className="text-primary"
        />
      ),
    },
    {
      url: '/admin/dashboard/users',
      text: 'Users',
      icon: (
        <Icon
          icon="mdi:account"
          width="24"
          height="24"
          className="text-warning"
        />
      ),
    },
  ]
  const [showManagements, setshowManagements] = useState(false)
  return (
    <div className="navbar fixed top-0 left-0 bg-accent shadow-sm z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle text-white"
          >
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
                href="/admin/dashboard"
                className={`${
                  router.pathname === '/admin/dashbord' ? 'active' : ''
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
      <div className="navbar-center text-white">
        <Link href="/admin/dashboard" className="btn btn-ghost text-xl">
          <img className="h-[30px]" src="/favicon.svg" alt="jofi logo" />
          <sup
            style={{
              fontSize: '8px',
              fontWeight: '500',
              backgroundColor: 'oklch(var(--a))',
            }}
          >
            ADMIN
          </sup>
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <button className="btn btn-ghost btn-circle text-white">
              <div className="indicator">
                <Icon icon="material-symbols:person" width="24" height="24" />
              </div>
            </button>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box min-w-[150px]"
          >
            <div className="p-2 pb-0 text-xs text-center">
              {auth?.user?.username}
            </div>
            <div className="divider my-1"></div>
            <li>
              <ThemeSwitch variant="dropdown-button" />
            </li>
            <li>
              <button
                onClick={() => {
                  auth?.signOut(() => {
                    router.push('/admin/auth/signin')
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

export default AdminNavbar
