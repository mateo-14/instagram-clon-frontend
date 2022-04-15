import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => logout(), []);

  return <></>
}
