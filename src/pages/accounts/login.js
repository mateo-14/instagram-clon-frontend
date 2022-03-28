import sharedStyles from 'styles/accounts/shared.module.css';
import Link from 'next/link';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    password: yup.string().required('Password is required'),
  })
  .required();

export default function Signin() {
  const { login, isLogged } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    const res = await login(data);
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
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={sharedStyles.inputWrapper}>
            <Input placeholder="Username" {...register('username')}></Input>
            <p className={sharedStyles.errorText}>{errors?.username?.message}</p>
          </div>
          <div className={sharedStyles.inputWrapper}>
            <Input placeholder="Password" {...register('password')} masked={true}></Input>
            <p className={sharedStyles.errorText}>{errors?.password?.message}</p>
          </div>

          <p className={sharedStyles.errorText}>{errors?.submit?.message}</p>
          <Button className={sharedStyles.button} disabled={!formState.isValid}>
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
