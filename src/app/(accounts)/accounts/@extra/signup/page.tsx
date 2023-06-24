import Link from 'next/link'
import accountsStyles from '../../accounts.module.css'

export default function Extra (): JSX.Element {
  return <>  <p className={accountsStyles.text}>
    {'Have an account? '}
    <Link href={'/accounts/login'} className={accountsStyles.link}>
      Log in
    </Link>
  </p></>
}
