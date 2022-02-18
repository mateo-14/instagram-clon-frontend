import AuthProvider from 'context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../styles/globals.css';
import { ReactQueryDevtools } from 'react-query/devtools';

export const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
