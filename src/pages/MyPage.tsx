import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/profile';
import { signOut } from '../api/auth';
import { PageTitle } from '../components/PageTitle';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PATHS } from '../routes/paths';
import type { Profile } from '../types';
import { LoadingText } from '../components/LoadingText';

export default function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    getProfile().then((data) => {
      if (!ignore) {
        setProfile(data);
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <PageTitle label="MY PAGE" title="내 정보" />
        <div className="flex h-40 items-center justify-center">
          <LoadingText text="정보를 불러오는 중..." />
        </div>
      </div>
    );
  }

  const interestsText =
    profile?.interests && profile.interests.length > 0
      ? profile.interests.join(', ')
      : '';
      
  const displayRegion = profile?.region?.trim() || '서울특별시 중구';

  return (
    <div className="flex flex-col">
      <PageTitle label="MY PAGE" title="내 정보" />

      <div className="flex flex-col px-10">
        <div className="rounded-card border border-border bg-surface px-6 py-4">
          <h2 className="text-section text-text-main">
            {profile?.nickname || '닉네임 없음'}
          </h2>

          <hr className="my-2 border-border" />

          <div className="flex flex-col gap-2">
            {/* 지역 */}
            <div className="flex items-center gap-3 p-1">
              <span className="inline-flex shrink-0 items-center justify-center w-14 rounded-[12px] bg-surface-warm text-caption text-text-main">
                지역
              </span>
              <span className="text-caption text-text-main">
                {displayRegion}
              </span>
            </div>

            {/* 관심 분야 */}
            <div className="flex items-center gap-3 p-1">
              <span className="inline-flex shrink-0 items-center justify-center w-14 rounded-[12px] bg-surface-warm text-caption text-text-main">
                관심 분야
              </span>
              <span className="text-caption text-text-main">
                {interestsText?.trim() || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* 수정하기 및 로그아웃 버튼 */}
        <div className="mt-3 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(PATHS.mypageEdit)}
          >
            수정하기
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={async () => {
              await signOut();
              navigate(PATHS.login, { replace: true });
            }}
          >
            로그아웃
          </Button>
        </div>

        {/* 하단 개인정보 처리 안내 링크 */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-caption text-text-sub underline"
          >
            개인정보 처리 안내
          </button>
        </div>
      </div>

      {/* 개인정보 처리 안내 모달 */}
      <Modal
        open={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="개인정보 처리 안내"
        footer={
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setIsPrivacyModalOpen(false)}
            >
              닫기
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2 py-2 text-caption text-text-main leading-relaxed">
          <p>
            아리톤 서비스는 학교 밖 청소년의 맞춤형 지원 정보 제공 및 목표 달성을 위해 최소한의 정보(닉네임, 지역, 관심 분야)를 수집합니다.
          </p>
          <p className="text-text-sub">
            수집된 정보는 지원 기관 및 맞춤 서비스 추천 목적으로만 활용되며, 언제든지 마이페이지에서 수정하거나 삭제할 수 있습니다.
          </p>
        </div>
      </Modal>
    </div>
  );
}
