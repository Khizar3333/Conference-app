"use client"
import MagicProvider from '@/hooks/MagicProvider';

import { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import Login from '@/components/magic/login/Login';
import Dashboard from '@/components/ui/Dashboard';
import MagicDashboardRedirect from '@/components/ui/MagicDashboardRedirect';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  return (
    <MagicProvider>
      
      {process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
        token.length > 0 ? (
          <Dashboard token={token} setToken={setToken} />
        ) : (
          <Login token={token} setToken={setToken} />
        )
      ) : (
        <MagicDashboardRedirect />
      )}
    </MagicProvider>
  );
}
