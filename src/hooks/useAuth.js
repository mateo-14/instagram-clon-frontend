import { AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import * as authService from 'services/authService';

export default function useAuth(redirect = true) {
  const { state, setAuthData, logout: _logout } = useContext(AuthContext);
  const { data, isLogged, isLoading } = state;
  const router = useRouter();

  const login = async (data) => {
    const res = await authService.login(data);
    if (!res.errors) setAuthData(res);
    return res;
  };

  const signUp = async (data) => {
    const res = await authService.signUp(data);
    if (!res.errors) setAuthData(res);
    return res;
  };

  const logout = () => _logout();

  useEffect(() => {
    if (redirect && !isLoading && !isLogged) router.push('/accounts/login');
  }, [redirect, isLogged, isLoading, router]);

  return { data, isLogged, isLoading, login, signUp, logout };
}
