import sharedStyles from 'styles/auth/shared.module.css';
import Link from 'next/link';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import styles from 'styles/auth/Signup.module.css';

export default function Signup() {
  return (
    <AuthPage.Layout title={'Login'}>
      <AuthPage.MainSection>
        <p className={styles.infoText}>Sign up to see photos and videos from your friends.</p>
        <form className={sharedStyles.form}>
          <Input placeholder="Username"></Input>
          <Input placeholder="Full Name"></Input>
          <Input placeholder="Password" masked={true}></Input>
          <Button className={sharedStyles.button} disabled>
            Sign up
          </Button>
        </form>
      </AuthPage.MainSection>
      <AuthPage.ExtraSection>
        <p className={sharedStyles.text}>
          {`Have an account? `}
          <Link href={'/auth/login'}>
            <a className={sharedStyles.link}>Log in</a>
          </Link>
        </p>
      </AuthPage.ExtraSection>
    </AuthPage.Layout>
  );
}
