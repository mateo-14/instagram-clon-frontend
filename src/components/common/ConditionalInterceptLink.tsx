import Link, { type LinkProps } from 'next/link'

interface ConditionalInterceptLinkProps extends LinkProps {
  intercept?: boolean
  children: React.ReactNode
  className?: string
}

// next/link and router.push() intercept post route and open a modal, and I want to open the post page in mobile. So I created this component.
export default function ConditionalInterceptLink ({ intercept = true, children, ...props }: ConditionalInterceptLinkProps): JSX.Element {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    if (!intercept) {
      e.preventDefault()
      location.href = e.currentTarget.href
    }
  }

  return <Link {...props} onClick={handleLinkClick}>{children}</Link>
}
