import { AuthContext } from 'context/AuthContext';
import { useContext, useEffect } from 'react';
import * as authService from 'services/authService';
import {useNavigate} from 'react-router-dom';

export default function useAuth(redirect = true) {
  const { state, setAuthData, logout: _logout } = useContext(AuthContext);
  const { data, isLogged, isLoading } = state;
  const navigate = useNavigate();

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
    if (redirect && !isLoading && !isLogged) navigate('/accounts/login');
  }, [redirect, isLogged, isLoading, navigate]);

  return { data, isLogged, isLoading, login, signUp, logout };
}
