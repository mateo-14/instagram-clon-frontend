'use client'

import accountsStyles from '../accounts.module.css'
import Input from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import styles from './Signup.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { signUp } from '@/services/authService'
import axios from 'axios'
import { type SignUpErrors } from '@/types/auth'
import { useRouter } from 'next/navigation'

const schema = yup
  .object({
    username: yup
      .string()
      .trim()
      .required('Username is required')
      .max(25, 'Username must be 3 to 25 characters long')
      .min(3, 'Username must be 3 to 25 characters long'),
    password: yup
      .string()
      .required('Password is required')
      .max(30, 'Password must be 4 to 25 characters long')
      .min(4, 'Password must be 4 to 25 characters long'),
    displayName: yup.string().trim().optional().max(30, 'Name must be less than 30 characters')
  })

export default function SignupForm (): JSX.Element {
  const router = useRouter()
  const { login, isLogged } = useAuth(false)
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })
  const { errors } = formState

  const onSubmit = async (data: any): Promise<void> => {
    try {
      const resData = await signUp(data)
      login(resData)
    } catch (err) {
      if (axios.isAxiosError<SignUpErrors>(err)) {
        if (err.response != null && err.response.status !== 500) {
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            if (key === 'error') {
              setError('root.error', { message: value })
            } else {
              setError(key as keyof Omit<SignUpErrors['errors'], 'error'>, { message: value })
            }
          })
        }
      }
    }
  }

  useEffect(() => {
    if (isLogged) {
      if (formState.isSubmitted) router.push('/')
      else router.replace('/')
    }
  }, [isLogged])

  return (
    <>
      <p className={styles.infoText}>Sign up to see photos and videos from your friends.</p>
      <form className={accountsStyles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={accountsStyles.inputWrapper}>
          <Input placeholder="Username" {...register('username')}></Input>
          <p className={accountsStyles.errorText}>{errors?.username?.message}</p>
        </div>
        <div className={accountsStyles.inputWrapper}>
          <Input placeholder={'Full name'} {...register('displayName')}></Input>
          <p className={accountsStyles.errorText}>{errors?.displayName?.message}</p>
        </div>
        <div className={accountsStyles.inputWrapper}>
          <Input placeholder="Password" {...register('password')} masked={true}></Input>
          <p className={accountsStyles.errorText}>{errors?.password?.message}</p>
        </div>
        <p className={accountsStyles.errorText}>{errors.root?.error.message}</p>

        <Button
          className={accountsStyles.button}
          disabled={!formState.isValid || formState.isSubmitting}
          type="submit"
        >
          Sign up
        </Button>
      </form>
    </>
  )
}
