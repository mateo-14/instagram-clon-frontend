import SplashScreen from '@/components/SplashScreen/SplashScreen'
import './globals.css'
import Providers from '@/Providers'

export const metadata = {
  title: 'Instagram Clon',
  description: 'Instagram Clon Made with Next.js 13 app Router'
}

export default function RootLayout ({
  children,
  postModal
}: {
  children: React.ReactNode
  postModal: React.ReactNode
}): JSX.Element {
  return (
    <Providers>
      <html lang="en">
        <body>
          {children}
          <SplashScreen />
        </body>
      </html>
    </Providers>
  )
}
