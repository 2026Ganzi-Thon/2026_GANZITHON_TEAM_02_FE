import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuthMe } from '../api/auth';
import { getAccessToken } from '../utils/authStorage';

export type AuthStatus = 'loading' | 'unauthenticated' | 'needs_setup' | 'authenticated';

/**
 * 전역 인증 상태 가드 훅
 */
export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const location = useLocation();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const token = getAccessToken();
      if (!token) {
        if (active) setStatus('unauthenticated');
        return;
      }

      try {
        const authMe = await getAuthMe();
        if (!active) return;
        if (!authMe.initial_setup_completed) {
          setStatus('needs_setup');
        } else {
          setStatus('authenticated');
        }
      } catch {
        if (active) setStatus('unauthenticated');
      }
    }

    void checkAuth();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  return status;
}
