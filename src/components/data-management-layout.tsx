import { Icon } from '@iconify-icon/react'
import Head from 'next/head'
import React, { useState } from 'react'

const DataManagementLayout: React.FC<{
  children: React.ReactNode
  headerTitle: string
  title: string
  noExpander?: boolean
}> = ({ children, headerTitle, title, noExpander }) => {
  const [wide, setWide] = useState(false)

  return (
    <main
      className={`min-h-screen w-full px-4 pt-24 pb-32 mx-auto ${
        wide ? '' : 'max-w-7xl'
      }`}
    >
      <Head>
        <title>{title}</title>
      </Head>

      {/* <Sidebar /> */}

      <header className="mb-10 text-2xl font-semibold flex items-center gap-4 justify-between">
        <h3>{headerTitle}</h3>

        <div>
          {!noExpander && (
            <div className="tooltip" data-tip="Expand">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setWide(!wide)}
              >
                {wide ? (
                  <Icon
                    icon="lucide:chevrons-right-left"
                    width="20"
                    height="20"
                  />
                ) : (
                  <Icon
                    icon="lucide:chevrons-left-right"
                    width="20"
                    height="20"
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {children}
    </main>
  )
}

export default DataManagementLayout
