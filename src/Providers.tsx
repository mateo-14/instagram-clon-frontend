'use client'

import AuthProvider from "./context/AuthContext"

export default function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return <AuthProvider>{children}</AuthProvider>
}