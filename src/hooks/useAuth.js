import { AuthContext } from 'context/AuthContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserById } from 'services/usersService'
import { useQuery } from 'react-query'
import { queryClient } from 'src/main'

export default function useAuth(redirect = true) {
  const { state, logout, login } = useContext(AuthContext)
  const { isLogged, isLoading, userId } = state
  const navigate = useNavigate()

  const { data } = useQuery(['users', userId], () => getUserById(userId), {
    enabled: !!userId
  })

  const logoutAndClear = () => {
    logout()
    queryClient.clear()
  }
  
  useEffect(() => {
    if (redirect && !isLoading && !isLogged) navigate('/accounts/login')
  }, [redirect, isLogged, isLoading, navigate])

  return { isLogged, isLoading, data, login, logout: logoutAndClear }
}
