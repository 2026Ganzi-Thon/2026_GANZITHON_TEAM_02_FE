import { useState } from 'react';
import { Button } from '../components/Button';
import { PageTitle } from '../components/PageTitle';
import { MobileLayout } from '../layouts/MobileLayout';
import { GoalSettingPage } from '../pages/goal/GoalSettingPage';

/**
 * 페이지 확인용 미리보기 (개발 전용, /preview.html?page=...).
 * 라우터(팀원B 담당)가 들어오기 전까지 App.tsx를 건드리지 않고 화면을 확인하기 위한 진입점.
 */
export function PagePreview({ page }: { page: string }) {
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (page !== 'goal-setting') {
    return (
      <MobileLayout>
        <PageTitle title="없는 미리보기 페이지예요" description="사용 가능: ?page=goal-setting" />
      </MobileLayout>
    );
  }

  if (completed) {
    return (
      <MobileLayout>
        <PageTitle label="PREVIEW" title="목표를 저장했어요" description="라우터가 연결되면 여기서 홈(또는 로그인)으로 이동합니다." />
        <div className="px-10">
          <Button
            fullWidth
            onClick={() => {
              setCompleted(false);
              setRound(round + 1);
            }}
          >
            처음부터 다시 보기
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return <GoalSettingPage key={round} onComplete={() => setCompleted(true)} />;
}
