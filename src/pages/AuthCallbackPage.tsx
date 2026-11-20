import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../layouts/MobileLayout';
import { supabase, USE_SUPABASE } from '../utils/supabase';
import { saveAccessToken, saveAuthUser, getStoredAuthUser } from '../utils/authStorage';
import { getAuthMe } from '../api/auth';
import { PATHS } from '../routes/paths';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      if (!USE_SUPABASE) {
        // Supabase 미설정 환경이면 로그인 페이지로 복귀
        navigate(PATHS.login, { replace: true });
        return;
      }

      try {
        // 1. 현재 세션 확인
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        let session = data.session;

        // 세션이 아직 안 잡혔다면 onAuthStateChange 리스너로 대기
        if (!session) {
          session = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(null), 5000);
            const { data: authListener } = supabase.auth.onAuthStateChange(
              (_event, newSession) => {
                if (newSession) {
                  clearTimeout(timeout);
                  authListener.subscription.unsubscribe();
                  resolve(newSession);
                }
              },
            );
          });
        }

        if (!session?.access_token) {
          throw new Error('로그인 세션을 가져오지 못했습니다. 다시 시도해 주세요.');
        }

        // 2. Supabase access_token 저장
        saveAccessToken(session.access_token);

        // 3. 인증 사용자 정보 로컬 저장
        const user = session.user;
        const stored = getStoredAuthUser();
        saveAuthUser({
          userId: stored?.userId ?? 1,
          authUserId: user.id,
          loginProvider: 'KAKAO',
          isNewUser: stored ? stored.isNewUser : true,
          initialSetupCompleted: stored ? stored.initialSetupCompleted : false,
        });

        // 4. GET /api/auth/me 확인하여 분기
        //const authMe = await getAuthMe();
        await getAuthMe();
        if (!isMounted) return;

        // 재로그인시 홈으로 이동
        // if (authMe.next_step === 'INITIAL_SETUP' || !authMe.initial_setup_completed) {
        //   navigate(PATHS.onboardingSetup, { replace: true });
        // } else {
        //   navigate(PATHS.home, { replace: true });
        // }

        // 재로그인시 온보딩으로 이동
        navigate(PATHS.onboardingSetup, {replace:true})
      } catch (err) {
        console.error('카카오 OAuth 콜백 처리 중 오류:', err);
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : '로그인 처리 중 문제가 발생했어요.',
          );
          setTimeout(() => {
            if (isMounted) {
              navigate(PATHS.login, { replace: true });
            }
          }, 2000);
        }
      }
    }

    void handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <MobileLayout>
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        {errorMessage ? (
          <div className="space-y-2">
            <p className="text-body font-medium text-primary">{errorMessage}</p>
            <p className="text-caption text-text-sub">로그인 화면으로 이동합니다...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-body font-medium text-text-main">
              카카오 로그인 중이에요
            </p>
            <p className="text-caption text-text-sub">
              잠시만 기다려 주세요...
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
