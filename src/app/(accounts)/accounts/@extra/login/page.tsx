import Link from 'next/link'
import accountsStyles from '../../accounts.module.css'
export default function Extra (): JSX.Element {
  return <>
    <p className={accountsStyles.text}>
      {'Don\'t have an account? '}
      <Link href={'/accounts/signup'} className={accountsStyles.link}>
        Sign up
      </Link>
    </p>
  </>
}
