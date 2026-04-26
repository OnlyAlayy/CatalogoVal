import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router/AppRouter';
import { CreatorWatermark } from './components/ui/CreatorWatermark';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="bottom-right" />
        <CreatorWatermark />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
