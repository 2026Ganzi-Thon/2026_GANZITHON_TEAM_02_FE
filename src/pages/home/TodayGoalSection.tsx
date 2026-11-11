import { Button } from '../../components/Button';
import { TextButton } from '../../components/TextButton';
import type { DayStatus } from '../../types';

type TodayGoalSectionProps = {
  title: string;
  description: string;
  /** 오늘 기록 상태: none(1-1) / done·rest(1-2) */
  status: DayStatus;
  /** 기록 저장 중이면 true (버튼 비활성) */
  saving: boolean;
  onEdit: () => void;
  onDone: () => void;
  onRest: () => void;
};

/** Figma '오늘의 목표 영역' — 1-1(기록 전) / 1-2(실천 완료·쉬어감) */
export function TodayGoalSection({ title, description, status, saving, onEdit, onDone, onRest }: TodayGoalSectionProps) {
  const recorded = status !== 'none';

  return (
    <section className="flex flex-col gap-2 px-10 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-section text-text-main">오늘의 목표</h2>
        {!recorded && <TextButton onClick={onEdit}>수정하기</TextButton>}
      </div>

      <div className="flex flex-col gap-2 rounded-card border border-primary-pressed bg-surface-warm px-6 py-4">
        <p className="text-section text-text-main">{title}</p>
        <p className="break-keep text-caption whitespace-pre-line text-text-sub">{description}</p>
      </div>

      {status === 'none' && (
        <>
          <Button fullWidth disabled={saving} onClick={onDone}>
            오늘 실천했어요
          </Button>
          <TextButton disabled={saving} onClick={onRest}>
            오늘은 쉬어갈게요
          </TextButton>
        </>
      )}
      {status === 'done' && <p className="text-caption font-bold text-primary-pressed">목표 달성 완료</p>}
    </section>
  );
}
