import { Icon } from '@iconify-icon/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const Sidebar = () => {
  const router = useRouter()
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
    <aside
      className="fixed left-0 top-0 z-[20] h-screen bg-base-100 w-72"
      style={{
        boxShadow: 'oklch(var(--s)) 0px 3px 5px',
      }}
    >
      <div className="aside-header flex justify-between items-center h-[60px] px-4">
        <h2 className="font-bold text-lg">JOFI</h2>
        <div>
          <button className="btn btn-circle btn-sm">
            <Icon icon="material-symbols:chevron-left" width="20" height="20" />
          </button>
        </div>
      </div>

      <div className="divider mt-0"></div>

      <ul tabIndex={0} className="menu">
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
                  className={`${router.pathname === item.url ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
