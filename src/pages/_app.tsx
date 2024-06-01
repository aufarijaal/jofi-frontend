import { ThemeProvider } from '@/components/theme-provider'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistSans } from 'geist/font/sans'
import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import 'react-json-view-lite/dist/index.css'
import Head from 'next/head'
import { AuthContextProvider } from '@/context/AuthContext'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'

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
      <AuthContextProvider>
        <ModalProvider>
          <ModalContainer className="bg-black/10 grid place-items-center" />
          <Toaster
            duration={1500}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  'w-full p-4 shadow-lg shadow-base-300 flex font-sans items-center gap-4 duration-100',
                content: 'text-sm w-full',
                success: 'bg-success text-success-content',
                info: 'bg-info text-info-content',
                warning: 'bg-warning text-warning-content',
                error: 'bg-error text-error-content',
                default: 'bg-base-100 text-base-content',
                description: 'text-white text-xs',
                closeButton: 'bg-base-100 text-base-content',
              },
            }}
            closeButton
            icons={{
              warning: <Icon icon="line-md:alert" width={24} />,
              error: <Icon icon="line-md:alert-circle" width={24} />,
              info: <Icon icon="mdi:information-outline" width={24} />,
              success: <Icon icon="line-md:confirm-circle" width={24} />,
            }}
          />
          <ThemeProvider
            attribute="data-theme"
            enableSystem={false}
            defaultTheme="corporate"
            themes={['corporate', 'business']}
            disableTransitionOnChange
          >
            <NextTopLoader
              color="oklch(var(--a))"
              shadow=""
              showSpinner={false}
            />
            {router.pathname === '/404' ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <div className={`${GeistSans.className}`}>
                  <Component {...pageProps} />
                </div>
              </Layout>
            )}
          </ThemeProvider>
        </ModalProvider>
      </AuthContextProvider>
    </>
  )
}

// export default appWithTranslation(MyApp /*, nextI18NextConfig */)
export default MyApp
