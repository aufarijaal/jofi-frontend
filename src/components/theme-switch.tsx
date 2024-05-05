import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'

const ThemeSwitch: React.FC<{
  variant?: 'circle' | 'dropdown-button'
}> = ({ variant }) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return !variant || variant === 'circle' ? (
    <button
      className="btn btn-circle btn-sm btn-secondary text-white"
      onClick={() => setTheme(theme === 'corporate' ? 'business' : 'corporate')}
    >
      {theme === 'corporate' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  ) : (
    <button
      onClick={() => setTheme(theme === 'corporate' ? 'business' : 'corporate')}
      className="flex justify-between w-full"
    >
      <div>Theme</div>
      <div className="flex items-center">
        {theme === 'corporate' ? (
          <Icon icon="heroicons:sun-solid" width="20" height="20" />
        ) : (
          <Icon icon="heroicons:moon-solid" width="20" height="20" />
        )}
      </div>
    </button>
  )
}

export default ThemeSwitch
