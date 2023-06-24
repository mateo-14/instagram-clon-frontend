import { AuthContext } from '@/context/AuthContext'
import { useContext, useEffect } from 'react'
import { getUserById } from '@/services/usersService'
import useSWR, { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'
import { type User } from '@/types/user'

interface AuthHook {
  isLogged: boolean
  isLoading: boolean
  data?: User
  login: (data: any) => void
  logout: () => void
}

export default function useAuth (redirect: boolean = true): AuthHook {
  const { state, logout, login } = useContext(AuthContext)
  const router = useRouter()
  const { data, isLoading } = useSWR(state.userId != null ? ['users', state.userId] : null, async ([, userId]) => await getUserById(userId))
  const { mutate } = useSWRConfig()
  const logoutAndClear = (): void => {
    mutate(key => true, undefined, { revalidate: false }).then(() => {
      logout()
    }).catch(() => {
    })
  }

  useEffect(() => {
    if (redirect && !isLoading && !state.isLoading && !state.isLogged) router.push('/accounts/login')
  }, [redirect, state.isLogged, state.isLoading, isLoading])

  return { isLogged: state.isLogged, isLoading: state.isLoading || isLoading, data, login, logout: logoutAndClear }
}
