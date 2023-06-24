import { createContext, useEffect, useReducer } from 'react'
import { auth, deleteToken, setToken } from '@/services/authService'
import { type AuthData } from '@/types/auth'

const initialState = {
  isLogged: false,
  isLoading: true,
  userId: null
}

interface LoginAction {
  type: 'login'
  payload: {
    userId: number
  }
}

interface LogoutAction {
  type: 'logout'
}

interface LoadingEnableAction {
  type: 'loading/enable'
}

interface LoadingDisableAction {
  type: 'loading/disable'
}

type AuthAction = LoginAction | LogoutAction | LoadingEnableAction | LoadingDisableAction

type AuthState = Omit<typeof initialState, 'userId'> & {
  userId: number | null
}

export const AuthContext = createContext<{ state: AuthState, login: (data: AuthData) => void, logout: () => void }>({
  state: initialState,
  login: (_: AuthData) => { },
  logout: () => { }
})

function reducer (state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'login':
      return { isLogged: true, isLoading: false, userId: action.payload.userId }
    case 'logout':
      return { isLogged: false, isLoading: false, userId: null }
    case 'loading/enable':
      return { ...state, isLoading: true }
    case 'loading/disable':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default function AuthProvider ({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)

  const logout = (): void => {
    deleteToken()
    dispatch({ type: 'logout' })
  }

  const login = (data: AuthData): void => {
    setToken(data.token)
    dispatch({ type: 'login', payload: { userId: data.id } })
  }

  useEffect(() => {
    dispatch({ type: 'loading/enable' })
    auth()
      .then((data) => { login(data) })
      .catch(() => { })
      .finally(() => { dispatch({ type: 'loading/disable' }) })
  }, [])

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
