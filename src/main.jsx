import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from 'context/AuthContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { EventEmitter } from './events/EventEmitter'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

export const eventEmitter = new EventEmitter()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
)
