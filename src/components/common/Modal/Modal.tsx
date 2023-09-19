'use client'

import classNames from 'classnames'
import { type ReactPortal, forwardRef, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import CloseIcon from '@/components/common/Icons/CloseIcon'
import styles from './Modal.module.css'
import { CSSTransition } from 'react-transition-group'

function createWrapper (id: string): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('id', id)
  document.body.appendChild(wrapper)
  return wrapper
}

interface ModalProps {
  showCloseButton: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal ({ showCloseButton, onClose, children }: ModalProps): ReactPortal | null {
  const wrapperId = useId()
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (document.scrollingElement == null) return
    const container = document.body.querySelector<HTMLElement>('[data-allow-change-by-modal]')
    if (container == null) return

    if (container.style.position === 'fixed') return

    const previousWinScroll = window.scrollY
    container.style.top = `-${previousWinScroll}px`
    container.style.position = 'fixed'
    container.style.width = '100%'

    return () => {
      container.style.position = ''
      container.style.top = ''
      container.style.width = ''
    }
  }, [])

  useEffect(() => {
    let element = document.getElementById(`modal-${wrapperId}`)
    if (element == null) element = createWrapper(`modal-${wrapperId}`)
    setWrapper(element)
    return () => {
      element?.remove()
    }
  }, [])

  return wrapper != null
    ? createPortal(
      <CSSTransition in={true} appear timeout={150}>
        <div
          className={styles.background}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          {children}
          {showCloseButton && <CloseButton onClick={onClose} />}
        </div>
      </CSSTransition>,
      wrapper
    )
    : null
}

type ModalContentProps = {
  children: React.ReactNode
  className?: string
  showCloseButton?: false
  onClose?: () => void
} | {
  children: React.ReactNode
  className?: string
  showCloseButton: true
  onClose: () => void
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, className, showCloseButton = false, onClose }) => (
  <div className={classNames(styles.content, className)} role="dialog" aria-modal="true">
    {children}
    {showCloseButton && onClose != null && <CloseButton onClick={onClose} />}
  </div>
)

interface ModalHeaderProps {
  children: React.ReactNode
}
export const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => <header className={styles.header}>{children}</header>

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

const _ModalBody = ({ children, className }: ModalBodyProps, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => (
  <div className={classNames(styles.body, className)} ref={ref}>
    {children}
  </div>
)
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(_ModalBody)

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <footer className={classNames(styles.footer, className)}>{children}</footer>
)

interface CloseButtonProps {
  onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button className={styles.closeButton} onClick={onClick}>
    <CloseIcon />
  </button>
)
