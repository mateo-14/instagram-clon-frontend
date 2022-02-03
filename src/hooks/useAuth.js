import { AuthContext } from 'context/AuthContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import * as authService from 'services/authService';

export default function useAuth() {
  const { state, setAuthData, logout: _logout } = useContext(AuthContext);
  const { data, isLogged, isLoading } = state;
  
  const login = async (data) => {
    const res = await authService.login(data);
    if (!res.error) setAuthData(res);
    return res;
  };

  const signUp = async (data) => {
    const res = await authService.signUp(data);
    if (!res.error) setAuthData(res);
    return res;
  };

  const logout = () => _logout();

  return { data, isLogged, isLoading, login, signUp, logout };
}
