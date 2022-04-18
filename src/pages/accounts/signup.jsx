import sharedStyles from 'styles/accounts/shared.module.css';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import AuthPage from 'components/AuthPage';
import styles from 'styles/accounts/Signup.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import useTitle from 'hooks/useTitle';
import { Link, useNavigate } from 'react-router-dom';
import useFormErrorHandling from 'hooks/useFormErrorHandling';
import { signUp } from 'services/authService';

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
  const navigate = useNavigate();
  const { login, isLogged } = useAuth(false);
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors } = formState;

  const handleError = useFormErrorHandling(setError);

  const onSubmit = async (data) => {
    try {
      const resData = await signUp(data);
      login(resData);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (isLogged) {
      if (formState.isSubmitted) navigate('/');
      else navigate('/', { replace: true });
    }
  }, [isLogged, navigate]);

  useTitle('Signup - Instagram');

  return (
    <AuthPage.Layout>
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
          <p className={sharedStyles.errorText}>{errors?.error?.message}</p>

          <Button
            className={sharedStyles.button}
            disabled={!formState.isValid || formState.isSubmitting}
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </AuthPage.MainSection>
      <AuthPage.ExtraSection>
        <p className={sharedStyles.text}>
          {`Have an account? `}
          <Link to={'/accounts/login'} className={sharedStyles.link}>
            Log in
          </Link>
        </p>
      </AuthPage.ExtraSection>
    </AuthPage.Layout>
  );
}
