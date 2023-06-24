import { type AuthData } from '@/types/auth'
import restService from './restService'

export async function login (data: any): Promise<AuthData> {
  const res = await restService.post<AuthData>('auth/login', data)
  return res.data
}

export async function signUp (data: any): Promise<AuthData> {
  const res = await restService.post<AuthData>('auth/signup', data)
  return res.data
}

export async function auth (): Promise<AuthData> {
  const token = getTokenWithThrow()

  const res = await restService.get<AuthData>('auth', { headers: { authorization: `Bearer ${token}` } }).catch(async (err) => {
    if (err.status === 401) {
      deleteToken()
    }
    return await Promise.reject(err)
  })

  return res.data
}

export async function loginWithATestAccount (): Promise<AuthData> {
  const res = await restService.get<AuthData>('auth/testAccount')
  return res.data
}

export function getToken (): string | null {
  const token = localStorage.getItem('token')
  return token
}

export function deleteToken (): void {
  localStorage.removeItem('token')
}

export function setToken (token: string): void {
  localStorage.setItem('token', token)
}

export function getTokenWithThrow (): string {
  const token = getToken()
  if (token == null) {
    throw new Error('No token')
  }

  return token
}
