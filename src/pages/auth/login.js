import sharedStyles from 'styles/auth/shared.module.css';
import Link from 'next/link';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import { useRef } from 'react';

export default function Signin() {
  const ref = useRef();
  return (
    <AuthPage.Layout title={'Login'}>
      <AuthPage.MainSection>
        <form className={sharedStyles.form}>
          <Input placeholder="Username"></Input>
          <Input placeholder="Password" masked={true}></Input>
          <Button className={sharedStyles.button} disabled onClick={() => alert('a')}>
            Log in
          </Button>
        </form>
      </AuthPage.MainSection>
      <AuthPage.ExtraSection>
        <p className={sharedStyles.text}>
          {`Don't have an account? `}
          <Link href={'/auth/signup'}>
            <a className={sharedStyles.link}>Sign up</a>
          </Link>
        </p>
      </AuthPage.ExtraSection>
    </AuthPage.Layout>
  );
}
