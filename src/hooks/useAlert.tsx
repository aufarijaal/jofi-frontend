import { cn } from '@/lib/utils'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { useEffect, useState } from 'react'

export default function useAlert() {
  const [alert, setAlert] = useState<{
    message: string
    subMessage?: string
    type?: 'info' | 'success' | 'warning' | 'error'
  }>({
    message: '',
    subMessage: '',
    type: 'info',
  })

  function makeVariants({
    info,
    success,
    warning,
    error,
  }: any): React.ReactNode | string {
    switch (alert.type) {
      case 'info':
        return info
      case 'success':
        return success
      case 'error':
        return error
      case 'warning':
        return warning
      default:
        break
    }
  }

  const Alert: React.FC<{ dismissable?: boolean }> = ({ dismissable }) => {
    return (
      <div
        role="alert"
        className={cn([
          'bg-base-200 text-base-content shadow-lg p-4 relative',
          alert.message ? 'flex items-center gap-2' : 'hidden',
          makeVariants({
            info: 'alert-info',
            success: 'alert-success',
            warning: 'alert-warning',
            error: 'alert-error',
          }),
        ])}
      >
        {makeVariants({
          info: (
            <Icon
              icon="heroicons:information-circle"
              width="20"
              height="20"
              className="text-info"
            />
          ),
          error: (
            <Icon
              icon="heroicons:exclamation-triangle"
              width="20"
              height="20"
              className="text-error"
            />
          ),
          warning: (
            <Icon
              icon="heroicons:exclamation-circle"
              width="20"
              height="20"
              className="text-warning"
            />
          ),
          success: (
            <Icon
              icon="heroicons:check"
              width="24"
              height="24"
              className="text-success"
            />
          ),
        })}

        <div className="flex-grow">
          <h3 className="font-bold">{alert.message}</h3>
          <div className="text-xs">{alert.subMessage}</div>
        </div>

        {dismissable && (
          <button
            className="btn btn-sm"
            onClick={() =>
              setAlert({ message: '', subMessage: '', type: 'info' })
            }
          >
            Dismiss
          </button>
        )}

        <div
          className={cn([
            'h-1 w-full absolute bottom-0 left-0',
            makeVariants({
              info: 'bg-info',
              success: 'bg-success',
              warning: 'bg-warning',
              error: 'bg-error',
            }),
          ])}
        ></div>
      </div>
    )
  }

  return {
    setAlert,
    Alert,
  }
}
