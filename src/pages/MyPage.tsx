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
        <div className="flex max-h-[55dvh] scrollbar-hide flex-col gap-4 overflow-y-auto overscroll-contain py-2 pr-2 text-caption leading-relaxed text-text-main">
          {/* 안내 문구 */}
          <p>
            메에일은 학교 밖 청소년의 일상 관리와 지역 지원 정보 탐색을 돕기 위해 개인정보를 처리합니다.
          </p>

          {/* 1. 개인정보 이용 목적 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              1. 개인정보 이용 목적
            </h3>
            <div className="flex flex-col gap-2 text-text-sub">
              <p>
                · 카카오 로그인: 서비스 이용자를 구분하고 로그인 상태를 유지합니다.
              </p>
              <p>
                · 프로필 관리: 닉네임·지역·관심 분야를 저장하고, 프로필 표시와 지역별 지원 정보 제공에 활용합니다.
              </p>
              <p>
                · 목표 및 기록 관리: 목표·주간 계획·컨디션·실천 및 쉬어감 기록을 저장하고, 목표 관리와 기록판 표시에 활용합니다.
              </p>
              <p>
                · 메모 관리: 메모 내용과 작성 일시를 저장하고, 메모 조회·수정·삭제 기능을 제공합니다.
              </p>
            </div>
          </section>

          {/* 2. 카카오 로그인 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              2. 카카오 로그인
            </h3>
            <p className="text-text-sub">
              메에일은 카카오 계정으로 로그인합니다. 카카오 닉네임·프로필 사진·이메일 제공에 관한 동의 항목은 선택 사항으로 설정되어 있으며, 동의 여부는 카카오 로그인 과정에서 선택할 수 있습니다.
            </p>
          </section>

          {/* 3. 비공개 메모 및 목표 제안 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              3. 비공개 메모 및 목표 제안
            </h3>
            <div className="flex flex-col gap-3 text-text-sub">
              <p>
                작성한 메모는 다른 이용자에게 공개되지 않습니다.
              </p>
              <p>
                현재 목표와 주간 계획은 미리 구성된 내용과 규칙을 바탕으로 제안하며, 이용자의 정보를 외부 AI 서비스에 전달하지 않습니다.
              </p>
            </div>
          </section>

          {/* 4. 개인정보 보유 및 파기 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              4. 개인정보 보유 및 파기
            </h3>
            <div className="flex flex-col gap-3 text-text-sub">
              <p>
                개인정보는 수집일로부터 3개월간 보관한 후 파기합니다. 서비스가 먼저 종료되는 경우에는 종료일로부터 30일 이내에 파기하며, 두 기한 중 먼저 도래하는 기한을 적용합니다.
              </p>
              <p>
                다만, 관련 법령에 따라 보존해야 하는 정보는 해당 법령에서 정한 기간 동안 보관합니다.
              </p>
            </div>
          </section>

          {/* 5. 정보 수정 및 삭제 요청 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              5. 정보 수정 및 삭제 요청
            </h3>
            <div className="flex flex-col gap-3 text-text-sub">
              <p>
                닉네임·지역·관심 분야는 ‘내 정보’에서 수정할 수 있으며, 작성한 메모는 메모장에서 수정하거나 삭제할 수 있습니다.
              </p>
              <p>
                현재 서비스 내 회원 탈퇴 기능은 제공하지 않습니다. 계정 및 저장된 정보의 삭제를 원하면 아래 이메일로 요청해 주세요.
              </p>
              <p>
                개인정보의 열람·정정·삭제·처리정지를 요청할 수 있으며, 요청자 본인 여부를 확인한 후 관련 법령에 따라 처리하고 결과를 안내합니다. 문의 시 비밀번호나 주민등록번호는 보내지 마세요.
              </p>
            </div>
          </section>

          {/* 6. 개인정보 관련 문의 */}
          <section className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="font-semibold text-text-main">
              6. 개인정보 관련 문의
            </h3>
            <div className="flex flex-col gap-1 text-text-sub">
              <p>· 담당자: 주호연</p>
              <p>· 이메일: <a href="mailto:wnghdus10@gmail.com" className='break-all text-primary-pressed underline underline-offset-2'>wnghdus10@gmail.com</a></p>
            </div>
          </section>
        </div>
      </Modal>

    </div>
  );
}
