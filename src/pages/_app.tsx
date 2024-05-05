import { ThemeProvider } from '@/components/theme-provider'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistSans } from 'geist/font/sans'
import { usePathname } from 'next/navigation'
import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-json-view-lite/dist/index.css'
import Head from 'next/head'
import { cn } from '@/lib/utils'
import { AuthContextProvider } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const contextClass = {
    success: 'bg-base-100 border-success',
    error: 'bg-base-100 border-error',
    info: 'bg-base-100 border-info',
    warning: 'bg-base-100 border-warning',
    default: 'bg-base-100',
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <style global jsx>
        {`
          .Toastify__close-button {
            color: oklch(var(--bc));
            opacity: 1;
          }
          // .Toastify__close-button--default {
          // }
          // .Toastify__close-button > svg {
          // }
          // .Toastify__close-button:hover,
          // .Toastify__close-button:focus {
          // }
        `}
      </style>
      <AuthContextProvider>
        <ToastContainer
          autoClose={2000}
          hideProgressBar
          toastClassName={(context) =>
            cn(
              'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer mb-2 border shadow-lg',
              contextClass[context?.type || 'default']
            )
          }
          bodyClassName={() =>
            'text-sm font-white font-med block p-3 text-base-content w-full flex gap-2'
          }
          position="bottom-right"
          transition={undefined}
        />
        <ThemeProvider
          attribute="data-theme"
          enableSystem={false}
          defaultTheme="corporate"
          themes={['corporate', 'business']}
          disableTransitionOnChange
        >
          {router.pathname === '/404' ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <div className={`${GeistSans.variable} font-sans`}>
                <Component {...pageProps} />
              </div>
            </Layout>
          )}
        </ThemeProvider>
      </AuthContextProvider>
    </>
  )
}

// export default appWithTranslation(MyApp /*, nextI18NextConfig */)
export default MyApp
