import { AuthContext } from 'context/AuthContext';
import { useContext } from 'react';

export default function useAuth() {
  const { data, isLogged, isLoading } = useContext(AuthContext);
  return { data, isLogged, isLoading };
}
