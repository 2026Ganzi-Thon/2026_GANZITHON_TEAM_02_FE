import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/profile';
import { Header } from '../components/Header';
import { PageTitle } from '../components/PageTitle';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { MobileLayout } from '../layouts/MobileLayout';
import { PATHS } from '../routes/paths';
import { cn } from '../utils/cn';

const INTEREST_OPTIONS = [
  '검정고시 준비',
  '대학 진학',
  '진로 탐색',
  '취업, 자격증',
  '생활 습관, 건강',
  '마음 돌보기',
  '친구, 관계',
  '취미, 문화 활동',
  '생활 지원',
  '아직 잘 모르겠어요',
];

const UNDECIDED_OPTION = '아직 잘 모르겠어요';

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    getProfile().then((data) => {
      if (!ignore) {
        setNickname(data.nickname ?? '');
        setRegion(data.region ?? '');
        setSelectedInterests(data.interests ?? []);
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleInterest = (interest: string) => {
    if (interest === UNDECIDED_OPTION) {
      if (selectedInterests.includes(UNDECIDED_OPTION)) {
        setSelectedInterests([]);
      } else {
        // '아직 잘 모르겠어요' 선택 시 다른 관심 분야 모두 해제 (API 명세서 기준)
        setSelectedInterests([UNDECIDED_OPTION]);
      }
      return;
    }

    // 다른 항목 선택 시 '아직 잘 모르겠어요' 해제
    const withoutUndecided = selectedInterests.filter((item) => item !== UNDECIDED_OPTION);
    if (withoutUndecided.includes(interest)) {
      setSelectedInterests(withoutUndecided.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...withoutUndecided, interest]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const isUndecided = selectedInterests.includes(UNDECIDED_OPTION);
      await updateProfile({
        nickname: trimmedNickname,
        region: region.trim() || null,
        interests: isUndecided ? [] : selectedInterests,
        interestUndecided: isUndecided,
      });
      // 수정 완료 후 마이페이지로 이동
      navigate(PATHS.mypage);
    } catch (err) {
      console.error('프로필 수정 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout header={<Header showBack onBack={() => navigate(-1)} />}>
        <div className="flex h-64 items-center justify-center text-caption text-text-sub">
          내 정보를 불러오는 중...
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout header={<Header showBack onBack={() => navigate(-1)} />}>
      <form onSubmit={handleSubmit} className="flex flex-col pb-12">
        <PageTitle label="MY PAGE" title="내 정보 수정" />

        <div className="flex flex-col px-10">
          {/* 1. 닉네임 (필수) */}
          <div className="flex flex-col">
            <TextField
              label={
                <span>
                  닉네임 <span className="text-primary">*</span>
                </span>
              }
              tone="emphasis"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              maxLength={20}
              required
            />
          </div>

          <hr className="my-6 border-border" />

          {/* 2. 지역 (선택) */}
          <div className="flex flex-col">
            <h2 className="text-section text-text-main">지역 (선택)</h2>
            <p className="mt-1 mb-3 text-caption text-text-sub">
              지금 생활하는 시·군·구까지 적어주세요. 상세 주소는 필요하지 않아요.
            </p>
            <TextField
              tone="emphasis"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예: 경기도 부천시 소사구"
            />
          </div>

          <hr className="my-6 border-border" />

          {/* 3. 관심 분야 (선택) */}
          <div className="flex flex-col">
            <h2 className="text-section text-text-main">관심 분야 (선택)</h2>
            <p className="mt-1 mb-4 text-caption text-text-sub">
              여러 개 골라도 좋아요. 언제든 바꿀 수 있어요.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex h-[46px] w-full items-center justify-center rounded-chip border px-3 text-center text-caption transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-pressed',
                      isSelected
                        ? 'border-primary-pressed bg-primary-soft font-bold text-primary-pressed'
                        : 'border-border bg-surface font-normal text-text-main',
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 하단 액션 영역 */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!nickname.trim() || isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '수정하기'}
            </Button>

            <button
              type="button"
              onClick={() => navigate(PATHS.mypage)}
              className="text-caption text-text-sub underline"
            >
              나중에 선택할게요
            </button>
          </div>
        </div>
      </form>
    </MobileLayout>
  );
}
