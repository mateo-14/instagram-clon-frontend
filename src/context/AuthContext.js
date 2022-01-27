import { createContext, useState } from 'react';

export const AuthContext = createContext();

const STATES = {
  logged: { isLogged: true, isLoading: false, data: {
    username: 'null14__'
  } },
  notLogged: { isLogged: false, isLoading: false }
}
export default function AuthProvider({ children }) {
  const [state, setState] = useState(STATES.notLogged)

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}