import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/employer/:path*',
    '/admin/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
}
