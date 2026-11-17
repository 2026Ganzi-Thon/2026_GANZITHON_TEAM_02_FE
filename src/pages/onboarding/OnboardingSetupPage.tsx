import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConditionStep } from './ConditionStep';
import { NeedsStep, type Need } from './NeedsStep';
import { ProfileStep } from '../login/ProfileStep';

import { MobileLayout } from '../../layouts/MobileLayout';
import { getProfile, updateProfile } from '../../api/profile';
import { skipOnboarding } from '../../api/auth';
import { saveTodayCondition, saveTodayHelp } from '../../api/condition';
import { getAccessToken } from '../../utils/authStorage';
import { UNDECIDED_INTEREST } from '../login/constants';
import { PATHS } from '../../routes/paths';
import type { HelpType } from '../../types';

type SetupStep = 'condition' | 'needs' | 'profile';

const NEED_TO_HELP_TYPE_MAP: Record<Need, HelpType> = {
  goal: 'SMALL_GOAL',
  journal: 'MEMO',
  information: 'PROGRAM',
  counseling: 'COUNSELING',
  rest: 'REST',
};

export function OnboardingSetupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<SetupStep>('condition');

  // 프로필 입력 상태
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. 기존 프로필 및 인증 확인
  useEffect(() => {
    let active = true;

    const initializeProfile = async () => {
      const token = getAccessToken();

      if (!token) {
        navigate(PATHS.login, { replace: true });
        return;
      }

      try {
        const profile = await getProfile();

        if (!active) return;

        // 이미 초기 설정이 완료된 사용자면 홈으로 직행
        if (profile.initial_setup_completed) {
          navigate(PATHS.home, { replace: true });
          return;
        }

        setNickname(profile.nickname ?? '');
        setRegion(profile.region ?? '');
        setSelectedInterests(profile.interests ?? []);
      } catch {
        if (active) {
          setError('프로필 정보를 불러오지 못했어요.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void initializeProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Step 1: 컨디션 저장 (PUT /api/conditions/today)
  const handleConditionNext = async (condition: 'good' | 'bad' | 'skipped') => {
    try {
      await saveTodayCondition(condition);
    } catch (e) {
      console.warn('컨디션 저장 실패:', e);
    }

    // 힘들어요를 고른 경우에만 필요한 도움 선택(NeedsStep)으로 이동
    if (condition === 'bad') {
      setStep('needs');
    } else {
      setStep('profile');
    }
  };

  // Step 2: 필요한 도움 저장 (PUT /api/conditions/today/help)
  const handleNeedsNext = async (need: Need | null) => {
    if (need) {
      try {
        const helpType = NEED_TO_HELP_TYPE_MAP[need];
        await saveTodayHelp(helpType);
      } catch (e) {
        console.warn('도움 선택 저장 실패:', e);
      }
    }
    setStep('profile');
  };

  const handleNeedsBack = () => {
    setStep('condition');
  };

  // 관심 분야 토글
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (interest === UNDECIDED_INTEREST) {
        return prev.includes(interest) ? [] : [interest];
      }

      const filtered = prev.filter((item) => item !== UNDECIDED_INTEREST);

      return filtered.includes(interest)
        ? filtered.filter((item) => item !== interest)
        : [...filtered, interest];
    });
  };

  // Step 3: 프로필 저장 (PUT /api/users/me/profile)
  const handleProfileSubmit = async () => {
    if (submitting) return;

    if (!nickname.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const interestUndecided = selectedInterests.includes(UNDECIDED_INTEREST);

      const profilePayload = {
        nickname: nickname.trim(),
        region: region.trim() || null,
        interests: interestUndecided ? [] : selectedInterests,
        interest_undecided: interestUndecided,
      };

      await updateProfile(profilePayload);

      // 설정 완료 후 홈으로 이동!
      navigate(PATHS.home, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '프로필 저장 중 문제가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 초기 설정 건너뛰기 (POST /api/users/me/onboarding/skip)
  const handleSkip = async () => {
    if (submitting) return;

    setError('');
    setSubmitting(true);

    try {
      await skipOnboarding();
      navigate(PATHS.home, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '잠시 후 다시 시도해 주세요.',
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
            프로필 정보를 확인하고 있어요...
          </p>
        </div>
      </MobileLayout>
    );
  }

  // 1. 컨디션 선택
  if (step === 'condition') {
    return <ConditionStep onNext={handleConditionNext} />;
  }

  // 2. 필요한 도움 선택 (힘들어요 선택 시)
  if (step === 'needs') {
    return <NeedsStep onNext={handleNeedsNext} onBack={handleNeedsBack} />;
  }

  // 3. 프로필 설정
  return (
    <MobileLayout>
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
    </MobileLayout>
  );
}
