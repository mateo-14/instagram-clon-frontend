import sharedStyles from 'styles/accounts/shared.module.css';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import useTitle from 'hooks/useTitle';
import { Link, useNavigate } from 'react-router-dom';

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    password: yup.string().required('Password is required'),
  })
  .required();

export default function Login() {
  const { login, isLogged, loginWithATestAccount } = useAuth(false);
  const navigate = useNavigate();
  const [isTestLoginLoading, setIsTestLoginLoading] = useState(false);

  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    const res = await login(data);

    if (res.errors) {
      for (const field in res.errors) {
        setError(field, { message: res.errors[field] });
      }
    }
  };

  useEffect(() => {
    if (isLogged) {
      if (formState.isSubmitted) navigate('/');
      else navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, navigate]);

  const loginTestAccount = async () => {
    setIsTestLoginLoading(true);
    const res = await loginWithATestAccount();
    if (res.errors) {
      setIsTestLoginLoading(false);
      setError('error', { message: res.errors.error });
    }
  };

  useTitle('Login - Instagram');
  return (
    <AuthPage.Layout>
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

          <p className={sharedStyles.errorText}>{errors?.error?.message}</p>
          <Button
            className={sharedStyles.button}
            disabled={!formState.isValid || formState.isSubmitting || isTestLoginLoading}
          >
            Log in
          </Button>
          <Button
            type="button"
            onClick={loginTestAccount}
            disabled={isTestLoginLoading || formState.isSubmitting}
          >
            Login with a test account
          </Button>
        </form>
      </AuthPage.MainSection>
      <AuthPage.ExtraSection>
        <p className={sharedStyles.text}>
          {`Don't have an account? `}
          <Link to={'/accounts/signup'} className={sharedStyles.link}>
            Sign up
          </Link>
        </p>
      </AuthPage.ExtraSection>
    </AuthPage.Layout>
  );
}
