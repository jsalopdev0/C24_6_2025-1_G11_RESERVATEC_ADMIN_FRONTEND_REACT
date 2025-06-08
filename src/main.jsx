// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 🆕
import './index.css';

// ⚙️ Configura el cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 10000, // 🔁 Actualiza cada 10s automáticamente
      refetchOnWindowFocus: true, // 🔄 También si el usuario vuelve a la pestaña
      staleTime: 0, // Considera que los datos están viejos inmediatamente
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="861236663472-sa3v01inonk082su43fo069hlfqfn77o.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
