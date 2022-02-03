import sharedStyles from 'styles/auth/shared.module.css';
import Link from 'next/link';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import styles from 'styles/auth/Signup.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';

const schema = yup
  .object({
    username: yup
      .string()
      .trim()
      .required('Username is required')
      .max(25, 'Username must be 3 to 25 characters long')
      .min(3, 'Username must be 3 to 25 characters long'),
    displayName: yup.string().trim().optional().max(30, 'Name must be less than 30 characters'),
    password: yup
      .string()
      .required('Password is required')
      .max(30, 'Password must be 4 to 25 characters long')
      .min(4, 'Password must be 4 to 25 characters long'),
  })
  .required();

export default function Signup() {
  const router = useRouter();
  const { signUp, isLogged } = useAuth();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    const res = await signUp(data);
    if (!res.error) return;

    if (res.errors) {
      for (const field in res.errors) {
        setError(field, { message: res.errors[field] });
      }
    } else setError('submit', { message: res.error });
  };

  useEffect(() => {
    if (isLogged) {
      if (formState.isSubmitted) router.push('/');
      else router.replace('/');
    }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, router]);

  return (
    <AuthPage.Layout title={'Login'}>
      <AuthPage.MainSection>
        <p className={styles.infoText}>Sign up to see photos and videos from your friends.</p>
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={sharedStyles.inputWrapper}>
            <Input placeholder="Username" {...register('username')}></Input>
            <p className={sharedStyles.errorText}>{errors?.username?.message}</p>
          </div>
          <div className={sharedStyles.inputWrapper}>
            <Input placeholder={'Full name'} {...register('displayName')}></Input>
            <p className={sharedStyles.errorText}>{errors?.displayName?.message}</p>
          </div>
          <div className={sharedStyles.inputWrapper}>
            <Input placeholder="Password" {...register('password')} masked={true}></Input>
            <p className={sharedStyles.errorText}>{errors?.password?.message}</p>
          </div>
          <p className={sharedStyles.errorText}>{errors?.submit?.message}</p>

          <Button className={sharedStyles.button} disabled={!formState.isValid}>
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
