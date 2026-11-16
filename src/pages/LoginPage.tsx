import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../layouts/MobileLayout';
import { getProfile, updateProfile, skipOnboarding } from '../api/auth';
import { getAccessToken } from '../utils/authStorage';
import { MOCK_AUTH, UNDECIDED_INTEREST } from './login/constants';
import type { LoginStep as LoginStepType } from './login/types';
import { LoginStep } from './login/LoginStep';
import { ProfileStep } from './login/ProfileStep';

export default function LoginPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStepType>('login');
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<
    string[]
  >([]);

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
          navigate('/', { replace: true });
          return;
        }

        setNickname(profile.nickname ?? '');
        setRegion(profile.region ?? '');
        setSelectedInterests(profile.interests ?? []);
        setStep('profile');
      } catch {
        if (active) {
          // TODO: 토큰 갱신 API 연동 후 처리
          setStep('login');
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
      setStep('profile');
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
      //   setStep('profile');
      // } else {
      //   navigate('/', { replace: true });
      // }

      throw new Error('카카오 인증 방식이 아직 설정되지 않았어요.');
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

  // 관심 분야 선택
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (interest === UNDECIDED_INTEREST) {
        return prev.includes(interest) ? [] : [interest];
      }

      const filtered = prev.filter(
        (item) => item !== UNDECIDED_INTEREST,
      );

      return filtered.includes(interest)
        ? filtered.filter((item) => item !== interest)
        : [...filtered, interest];
    });
  };

  // 프로필 저장
  const handleProfileSubmit = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const interestUndecided =
        selectedInterests.includes(UNDECIDED_INTEREST);

      const profilePayload = {
        nickname: nickname.trim(),
        region: region.trim() || null,
        interests: interestUndecided
          ? []
          : selectedInterests,
        interest_undecided: interestUndecided,
      };

      if (MOCK_AUTH) {
        // 임시 테스트: 서버 저장 없이 이동
        console.log('[MOCK] 프로필 저장:', profilePayload);
        navigate('/', { replace: true });
        return;
      }

      await updateProfile(profilePayload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '프로필 저장 중 문제가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 초기 설정 건너뛰기

  const handleSkip = async () => {
    setError('');
    setSubmitting(true);

    try {
      if (MOCK_AUTH) {
        navigate('/', { replace: true });
        return;
      }

      await skipOnboarding();
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 화면 렌더링

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
      {step === 'login' ? (
        <LoginStep
          onKakaoLogin={handleKakaoLogin}
          submitting={submitting}
          error={error}
        />
      ) : (
        <ProfileStep
          nickname={nickname}
          region={region}
          selectedInterests={selectedInterests}
          submitting={submitting}
          error={error}
          onNicknameChange={setNickname}
          onRegionChange={setRegion}
          onClearError={() => setError('')}
          onInterestToggle={handleInterestToggle}
          onProfileSubmit={handleProfileSubmit}
          onSkip={handleSkip}
        />
      )}
    </MobileLayout>
  );
}