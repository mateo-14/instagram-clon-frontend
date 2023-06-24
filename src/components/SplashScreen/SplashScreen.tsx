'use client'

import useAuth from '@/hooks/useAuth'
import Image from 'next/image'

export default function SplashScreen (): JSX.Element | null {
  const { isLoading } = useAuth(false)
  if (!isLoading) return null

  return <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Image src="/splash-screen-logo.png" alt="Instagram Logo" width={80} height={80}></Image>
  </div>
}
