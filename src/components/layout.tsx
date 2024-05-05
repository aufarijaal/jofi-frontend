import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from './footer/footer'
import AdminNavbar from './navbar/admin-navbar'
import EmployerNavbar from './navbar/employer-navbar'
import Head from 'next/head'
import { useTheme } from 'next-themes'

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const routesToIncludeAdminNavbar = [
    '/admin/dashboard',
    '/admin/dashboard/employer-requests',
    '/admin/dashboard/users',
    '/admin/dashboard/companies',
    '/admin/dashboard/job-categories',
  ]

  const routesToIncludeEmployerNavbar = [
    '/employer/dashboard',
    '/employer/dashboard/applications',
    '/employer/dashboard/job-posts',
  ]

  const routesToExcludeNavbar = [
    '/auth/signin',
    '/auth/signup',
    '/employer/auth/signin',
    '/employer/auth/signup',
    '/admin/auth/signin',
    '/forbidden',
    '/unauthorized',
    ...routesToIncludeAdminNavbar,
    ...routesToIncludeEmployerNavbar,
  ]

  const routesToExcludeFooter = [
    '/auth/signin',
    '/auth/signup',
    '/employer/auth/signin',
    '/employer/auth/signup',
    '/admin/auth/signin',
    '/forbidden',
    '/unauthorized',
    ...routesToIncludeAdminNavbar,
    ...routesToIncludeEmployerNavbar,
  ]

  return (
    <div id="root-layout">
      {routesToExcludeNavbar.includes(pathname) ? null : <Navbar />}
      {!routesToIncludeAdminNavbar.includes(pathname) ? null : <AdminNavbar />}
      {!routesToIncludeEmployerNavbar.includes(pathname) ? null : (
        <EmployerNavbar />
      )}
      {children}
      {routesToExcludeFooter.includes(pathname) ? null : <Footer />}
    </div>
  )
}

export default Layout
