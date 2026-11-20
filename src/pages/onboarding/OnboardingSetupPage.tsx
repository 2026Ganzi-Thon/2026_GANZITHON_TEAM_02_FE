import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConditionStep } from './ConditionStep';
import { NeedsStep, type Need } from './NeedsStep';
import { ProfileStep } from '../login/ProfileStep';

import { MobileLayout } from '../../layouts/MobileLayout';
import { LoadingText } from '../../components/LoadingText';
import { getProfile, updateProfile } from '../../api/profile';
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
  const [destination, setDestination] = useState<string>(PATHS.home);

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
        await getProfile();

        if (!active) return;

        // 이미 초기 설정이 완료된 사용자면 홈으로 직행
        // if (profile.initial_setup_completed) {
        //   navigate(PATHS.home, { replace: true });
        //   return;
        // }

        // // 초기 설정 화면에서는 이전 입력값이 뜨지 않도록 빈 값으로 시작 (placeholder 노출)
        setNickname('');
        setRegion('');
        setSelectedInterests([]);

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
      // 괜찮아요 -> 100일 목표 (/goals)
      // 건너뛰기 -> 홈 (/)
      const target = condition === 'good' ? PATHS.goals : PATHS.home;
      setDestination(target);
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

    // 유저플로우 분기:
    // 작은 목표 정하기 -> 100일 목표 (/goals)
    // 마음 적기 -> 비공개 메모장 (/memos)
    // 지원 정보 찾기 -> 프로그램 지원 목록 (/support?tab=programs)
    // 상담, 기관 연락 안내 -> 상담·기관 목록 (/support?tab=organizations)
    // 쉬어가기 / 나중에 선택 -> 홈 (/)
    let target: string;
    if (need === 'goal') {
      target = PATHS.goals;
    } else if (need === 'journal') {
      target = PATHS.memos;
    } else if (need === 'information') {
      target = `${PATHS.support}?tab=programs`;
    } else if (need === 'counseling') {
      target = `${PATHS.support}?tab=organizations`;
    } else {
      target = PATHS.home;
    }

    setDestination(target);
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
        region: region.trim() || '서울특별시 중구',
        interests: interestUndecided ? [] : selectedInterests,
        interest_undecided: interestUndecided,
      };

      await updateProfile(profilePayload);

      // 설정 완료 후 컨디션/도움 선택에 따른 목적지 페이지로 이동
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '프로필 저장 중 문제가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 초기 설정 '나중에 선택할게요' (닉네임 필수, 지역은 서울특별시 중구 기본, 관심 분야 빈칸)
  const handleSkip = async () => {
    if (submitting) return;

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError('닉네임을 입력해 주세요.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const profilePayload = {
        nickname: trimmedNickname,
        region: region.trim() || '서울특별시 중구',
        interests: [],
        interest_undecided: false,
      };

      await updateProfile(profilePayload);
      navigate(destination, { replace: true });
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
          <LoadingText text="프로필 정보를 확인하고 있어요..." />
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
