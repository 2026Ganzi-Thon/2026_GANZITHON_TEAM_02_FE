import { useState } from 'react';
import { BottomActionArea } from '../../components/BottomActionArea';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { PageTitle } from '../../components/PageTitle';
import { TextButton } from '../../components/TextButton';
import { WeeklyPlanList } from '../../components/WeeklyPlanList';
import { MobileLayout } from '../../layouts/MobileLayout';
import type { Goal } from '../../types';
import { GoalEditModal } from './GoalEditModal';
import { WeeklyPlanEditModal } from './WeeklyPlanEditModal';

export type GoalDraft = Pick<Goal, 'title' | 'description' | 'weeklyPlans'>;

type GoalPlanStepProps = {
  draft: GoalDraft;
  onChange: (draft: GoalDraft) => void;
  /** 저장 중이면 true (버튼 비활성) */
  saving: boolean;
  onStart: () => void;
};

/** Figma 2-2 목표 설정 확인 (180:10668) + 목표·주간 계획 수정 팝업 */
export function GoalPlanStep({ draft, onChange, saving, onStart }: GoalPlanStepProps) {
  const [modal, setModal] = useState<'goal' | 'plan' | null>(null);
  const closeModal = () => setModal(null);

  return (
    <MobileLayout
      header={<Header />}
      bottom={
        <BottomActionArea helperText="내용은 언제든 다시 바꿀 수 있어요">
          <Button fullWidth disabled={saving} aria-busy={saving} onClick={onStart}>
            이 계획으로 시작하기
          </Button>
        </BottomActionArea>
      }
    >
      <PageTitle
        label="100-DAY PLAN | 2/2"
        title="이렇게 시작해볼까요?"
        description="적어주신 내용을 바탕으로 정리했어요. 내 상황에 맞게 고쳐주세요."
      />

      <section className="flex flex-col gap-2 px-10 pb-8">
        <h2 className="text-section text-text-main">100일 동안 만들어갈 변화</h2>
        <div className="flex flex-col gap-2 rounded-card border border-primary-pressed bg-surface-warm px-6 py-4">
          <p className="text-section text-text-main">{draft.title}</p>
          <p className="text-caption text-text-sub">{draft.description}</p>
          <TextButton onClick={() => setModal('goal')}>목표 수정하기</TextButton>
        </div>
      </section>

      <section className="flex flex-col gap-2 px-10 pb-8">
        <h2 className="text-section text-text-main">주간 계획</h2>
        <WeeklyPlanList plans={draft.weeklyPlans} />
        <TextButton onClick={() => setModal('plan')}>계획 수정하기</TextButton>
      </section>

      <GoalEditModal
        open={modal === 'goal'}
        title={draft.title}
        onClose={closeModal}
        onSave={(title) => {
          onChange({ ...draft, title });
          closeModal();
        }}
      />
      <WeeklyPlanEditModal
        open={modal === 'plan'}
        plans={draft.weeklyPlans}
        onClose={closeModal}
        onSave={(weeklyPlans) => {
          onChange({ ...draft, weeklyPlans });
          closeModal();
        }}
      />
    </MobileLayout>
  );
}
