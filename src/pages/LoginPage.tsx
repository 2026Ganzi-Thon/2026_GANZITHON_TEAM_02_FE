
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileLayout } from '../layouts/MobileLayout';
import { getProfile } from '../api/auth';
import { getAccessToken } from '../utils/authStorage';
import { MOCK_AUTH } from './login/constants';
import { LoginStep } from './login/LoginStep';
import { PATHS } from '../routes/paths';

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!MOCK_AUTH);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 로그인 상태 확인
  useEffect(() => {
    if (MOCK_AUTH) return;

    let active = true;

    const initializeAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();

        if (!active) return;

        if (profile.initial_setup_completed) {
          navigate(PATHS.home, { replace: true });
        } else {
          navigate(PATHS.onboardingSetup, {
            replace: true,
          });
        }
      } catch {
        if (active) {
          // TODO: 토큰 갱신 API 연동 후 처리
          setError('');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      active = false;
    };
  }, [navigate]);

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    setError('');

    // 임시 UI 테스트
    if (MOCK_AUTH) {
      navigate(PATHS.onboardingSetup);
      return;
    }

    setSubmitting(true);

    try {
      // TODO:
      // 백엔드 인증 방식 확정 후
      // 카카오 SDK 또는 OAuth 인증 결과를 받아 전달
      //
      // 예시:
      // const authResult = {
      //   authorization_code: '카카오에서_발급받은_코드',
      // };
      //
      // const loginData = await loginWithKakao(authResult);
      // saveAuthTokens(loginData);
      //
      // if (loginData.next_step === 'INITIAL_SETUP') {
      //   navigate(PATHS.onboardingSetup, {
      //     replace: true,
      //   });
      // } else {
      //   navigate(PATHS.home, { replace: true });
      // }

      throw new Error(
        '카카오 인증 방식이 아직 설정되지 않았어요.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '로그인 중 문제가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-caption text-text-sub">
            로그인 정보를 확인하고 있어요...
          </p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <LoginStep
        onKakaoLogin={handleKakaoLogin}
        submitting={submitting}
        error={error}
      />
    </MobileLayout>
  );
}
