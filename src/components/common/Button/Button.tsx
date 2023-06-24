import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: 'solid' | 'outline' | 'text'
}

export function Button ({ children, className, onClick, disabled = false, type = 'button', style = 'solid' }: ButtonProps): JSX.Element {
  return (
    <button type={type} className={`${styles.button} ${styles[style]} ${className ?? ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

interface LinkButtonProps {
  children: React.ReactNode
  href: string
  className?: string
  style?: 'solid' | 'outline'
}

export function LinkButton ({ children, href, className, style = 'solid' }: LinkButtonProps): JSX.Element {
  return (
    <Link href={href} className={`${styles.button} ${styles[style]} ${className ?? ''}`}>
      {children}
    </Link>
  )
}
