'use client'
import { Button } from '@/components/common/Button'
import accountsStyles from '../accounts.module.css'
import Input from '@/components/common/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import * as authService from '@/services/authService'
import useAuth from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { type LoginErrors } from '@/types/auth'
import axios from 'axios'

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    password: yup.string().required('Password is required')
  })

export default function LoginForm (): JSX.Element {
  const router = useRouter()
  const { isLogged, login } = useAuth(false)
  const [isTestLoginLoading, setIsTestLoginLoading] = useState(false)
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  const { errors } = formState

  const onSubmit = async (data: unknown): Promise<void> => {
    try {
      const resData = await authService.login(data)
      login(resData)
    } catch (err) {
      if (axios.isAxiosError<LoginErrors>(err)) {
        if (err.response != null && err.response.status !== 500) {
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            if (key === 'error') {
              setError('root.error', { message: value })
            } else {
              setError(key as keyof Omit<LoginErrors['errors'], 'error'>, { message: value })
            }
          })
          return
        }
      }

      setError('root.error', { message: 'Something went wrong. Please try again later.' })
    }
  }

  useEffect(() => {
    if (isLogged) {
      if (formState.isSubmitted) router.push('/')
      else router.push('/', { replace: true })
    }
  }, [isLogged])

  const loginTestAccount = (): void => {
    setIsTestLoginLoading(true)
    authService.loginWithATestAccount()
      .then((data) => {
        login(data)
      })
      .catch(() => {
        setError('root.error', { message: 'Something went wrong. Please try again later.' })
      })
  }

  return <form className={accountsStyles.form} onSubmit={handleSubmit(onSubmit)}>
    <div className={accountsStyles.inputWrapper}>
      <Input placeholder="Username" {...register('username')}></Input>
      <p className={accountsStyles.errorText}>{errors?.username?.message}</p>
    </div>
    <div className={accountsStyles.inputWrapper}>
      <Input placeholder="Password" {...register('password')} masked={true}></Input>
      <p className={accountsStyles.errorText}>{errors?.password?.message}</p>
    </div>

    <p className={accountsStyles.errorText}>{errors?.root?.error.message}</p>
    <Button
      className={accountsStyles.button}
      disabled={!formState.isValid || formState.isSubmitting || isTestLoginLoading}
      type='submit'
    >
      Log in
    </Button>
    <Button
      type="button"
      onClick={loginTestAccount}
      disabled={formState.isSubmitting || isTestLoginLoading}
    >
      Login with a test account
    </Button>
  </form>
}
