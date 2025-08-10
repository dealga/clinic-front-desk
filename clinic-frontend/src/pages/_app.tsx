import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import { authService } from '../services/api';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(router.pathname);

    if (!isPublicPath && !authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;