import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRouter from '@/router/index';
import useAuthStore from '@/store/authStore';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        const noRetry = [401, 403, 404, 422];
        if (noRetry.includes(error?.response?.status)) return false;
        return failureCount < 2;
      },
    },
  },
});

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <>
      <AppRouter />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontFamily: 'inherit',
          },
        }}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
