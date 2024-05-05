import { Icon } from '@iconify-icon/react'
import Link from 'next/link'

export default function Custom404() {
  return (
    <main className="grid place-items-center min-h-screen w-full">
      <div className="flex items-center flex-col gap-6">
        <h1 className="text-5xl font-bold">404</h1>
        <p>Sorry, the page you are looking for cannot be found.</p>

        <Link href="/" className="btn">
          <Icon icon="mdi:home" width="20" height="20" />
          Back to home
        </Link>
      </div>
    </main>
  )
}
