import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface DialogProps {
  title: string
  subtitle?: string | React.ReactNode
  children: React.ReactNode
  additionalButtons?: React.ReactNode
  dialogId: string
  onClose?: () => void
  modalBoxClassName?: string
}

export default function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const btnClose = useRef<HTMLButtonElement>(null)
  const [showState, setShowState] = useState(false)

  function show() {
    setShowState(true)
  }

  function close() {
    setShowState(false)
  }

  useEffect(() => {
    if (showState) {
      dialogRef.current?.showModal()
    } else {
      btnClose.current?.click()
    }
  }, [showState])

  const Dialog: React.FC<DialogProps> = ({
    title,
    subtitle,
    children,
    additionalButtons,
    dialogId,
    onClose,
    modalBoxClassName,
  }) => {
    return showState ? (
      <dialog
        id={dialogId}
        className="modal"
        ref={dialogRef}
        onCancel={() => close()}
      >
        <div className={cn('modal-box', modalBoxClassName)}>
          <h3 className="font-bold text-lg">{title}</h3>
          {subtitle}

          <div className="modal-content">{children}</div>

          <div className="modal-action flex gap-1">
            <form method="dialog">
              <button
                id={`${dialogId}__close-button`}
                className="btn btn-sm"
                ref={btnClose}
                onClick={() => {
                  onClose?.()
                  close()
                }}
                type="button"
              >
                Close
              </button>
            </form>

            {additionalButtons && (
              <div className="flex gap-1">{additionalButtons}</div>
            )}
          </div>
        </div>
      </dialog>
    ) : null
  }

  return {
    dialogElement: dialogRef,
    closeButton: btnClose,
    show,
    close,
    Dialog,
    showState,
  }
}
