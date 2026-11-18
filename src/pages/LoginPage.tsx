import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileLayout } from '../layouts/MobileLayout';
import { getAuthMe, signInWithKakao } from '../api/auth';
import { getAccessToken, saveAccessToken } from '../utils/authStorage';
import { supabase, USE_SUPABASE } from '../utils/supabase';
import { LoginStep } from './login/LoginStep';
import { LoadingText } from '../components/LoadingText';
import { PATHS } from '../routes/paths';

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [testAsExistingUser, setTestAsExistingUser] = useState(false);

  // 1. 기존 로그인 세션 또는 OAuth 리다이렉트 콜백 확인
  useEffect(() => {
    let active = true;

    const handleAuthCheck = async () => {
      try {
        // 실제 Supabase OAuth 콜백인 경우 세션 처리
        if (USE_SUPABASE) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.access_token) {
            saveAccessToken(data.session.access_token);
          }
        }

        const token = getAccessToken();
        if (!token) {
          if (active) setLoading(false);
          return;
        }

        // 로그인된 토큰이 있으면 /api/auth/me 확인
        const authMe = await getAuthMe();
        if (!active) return;

        if (authMe.next_step === 'INITIAL_SETUP') {
          navigate(PATHS.onboardingSetup, { replace: true });
        } else {
          //navigate(PATHS.home, { replace: true });
          navigate(PATHS.onboardingSetup, { replace: true });
        }
      } catch (e) {
        console.error('인증 확인 중 오류:', e);
        if (active) setLoading(false);
      }
    };

    void handleAuthCheck();

    return () => {
      active = false;
    };
  }, [navigate]);

  // 2. 카카오 로그인 및 신규 가입 처리
  const handleKakaoLogin = async () => {
    setError('');
    setSubmitting(true);

    try {
      // 카카오 OAuth + Supabase Auth 로그인 요청
      const authResult = await signInWithKakao({
        isNewUser: !testAsExistingUser,
        forceMock: testAsExistingUser,
      });

      if (authResult?.next_step === 'INITIAL_SETUP') {
        navigate(PATHS.onboardingSetup, { replace: true });
      } else if (authResult?.next_step === 'HOME') {
        //navigate(PATHS.home, { replace: true });
        navigate(PATHS.onboardingSetup, { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '로그인 중 문제가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex h-full items-center justify-center">
          <LoadingText text="로그인 정보를 확인하고 있어요..." />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative flex flex-col h-full justify-between">
        <LoginStep
          onKakaoLogin={handleKakaoLogin}
          submitting={submitting}
          error={error}
        />

        {/* 백엔드 배포 전 Mock 로그인 시뮬레이션용 스위치 (신규 가입 vs 재이용 홈 직행) */}
        <div className="absolute bottom-10 left-0 right-0 z-10 text-center">
          <label className="inline-flex items-center gap-2 text-xs text-text-sub cursor-pointer select-none">
            <input
              type="checkbox"
              checked={testAsExistingUser}
              onChange={(e) => setTestAsExistingUser(e.target.checked)}
              className="accent-primary"
            />
            <span>(테스트용) 기존 회원으로 바로 로그인 (홈 진입)</span>
          </label>
        </div>
      </div>
    </MobileLayout>
  );
}
