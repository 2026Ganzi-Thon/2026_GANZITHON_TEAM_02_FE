
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConditionStep } from './ConditionStep';
import { NeedsStep } from './NeedsStep';
import { ProfileStep } from '../login/ProfileStep';

import { MobileLayout } from '../../layouts/MobileLayout';
import {
  getProfile,
  updateProfile,
  skipOnboarding,
} from '../../api/auth';
import { getAccessToken } from '../../utils/authStorage';
import {
  MOCK_AUTH,
  UNDECIDED_INTEREST,
} from '../login/constants';
import { PATHS } from '../../routes/paths';

type SetupStep = 'condition' | 'needs' | 'profile';

export function OnboardingSetupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<SetupStep>('condition');

  // 프로필 입력 상태
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(!MOCK_AUTH);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 기존 프로필 정보 확인
  useEffect(() => {
    if (MOCK_AUTH) return;

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

        if (profile.initial_setup_completed) {
          navigate(PATHS.home, { replace: true });
          return;
        }

        setNickname(profile.nickname ?? '');
        setRegion(profile.region ?? '');
        setSelectedInterests(profile.interests ?? []);
      } catch {
        if (active) {
          setError(
            '프로필 정보를 불러오지 못했어요.',
          );
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

    // ConditionStep → NeedsStep
    const handleConditionNext = () => {
        setStep('needs');
     };

    // NeedsStep → ProfileStep
    const handleNeedsNext = () => {
        setStep('profile');
    };

    const handleNeedsBack = () => {
        setStep('condition');
    };

    // 관심 분야 선택
    const handleInterestToggle = (interest: string) => {
        setSelectedInterests((prev) => {
        if (interest === UNDECIDED_INTEREST) {
            return prev.includes(interest)
            ? []
            : [interest];
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
        if (submitting) return;

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
            console.log(
            '[MOCK] 프로필 저장:',
            profilePayload,
            );
            navigate(PATHS.home, { replace: true });
            return;
        }

        await updateProfile(profilePayload);

        navigate(PATHS.home, { replace: true });
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
        if (submitting) return;

        setError('');
        setSubmitting(true);

        try {
        if (MOCK_AUTH) {
            navigate(PATHS.home, { replace: true });
            return;
        }

        await skipOnboarding();

        navigate(PATHS.home, { replace: true });
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

    // 프로필 로딩
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

    // 컨디션 선택
    if (step === 'condition') {
        return (
        <ConditionStep
            onNext={handleConditionNext}
        />
        );
    }

    // 필요한 도움 선택
    if (step === 'needs') {
        return (
        <NeedsStep
            onNext={handleNeedsNext}
            onBack={handleNeedsBack}
        />
        );
    }

    // 프로필 설정
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
