import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import Head from 'next/head';
import styles from 'styles/accounts/edit.module.css';
import Input from 'components/common/Input';
import InputTextArea from 'components/common/InputTextArea';
import Button from 'components/common/Button';
import { getUserById } from 'services/usersService';
import { useQuery } from 'react-query';
import { useEffect } from 'react';

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    password: yup.string().required('Password is required'),
  })
  .required();

export default function Edit() {
  const { data } = useAuth();
  const { data: user, status } = useQuery(['users', data.id], () => getUserById(data.id), {
    enabled: !!data.id,
  });

  const { register, handleSubmit, formState, setError, setValue } = useForm({
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
    if (!user) return;

    setValue('username', user.username);
    setValue('displayName', user.displayName);
    setValue('bio', user.bio);
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>Edit Profile - Instagram</title>
      </Head>
      <section className={styles.section}>
        <h1>Edit Profile</h1>
        <form className={styles.form}>
          {/* Name */}
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <Input
            id="displayName"
            className={styles.input}
            placeholder="Name"
            {...register('displayName')}
          />
          {/* Username */}

          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <Input
            id="username"
            className={styles.input}
            placeholder="Username"
            {...register('username')}
          />
          {/* Bio */}

          <label htmlFor="bio" className={styles.label}>
            Bio
          </label>
          <InputTextArea
            id="bio"
            bordered
            rows={6}
            maxRows={10}
            className={styles.textarea}
            {...register('bio')}
          />

          <Button className={styles.submit}>Submit</Button>
        </form>
      </section>
    </Layout>
  );
}
