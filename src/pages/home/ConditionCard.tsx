import conditionGoodIcon from '../../assets/home/condition-good.svg';
import conditionHardIcon from '../../assets/home/condition-hard.svg';
import type { Condition } from '../../types';

const CONDITION_VIEW: Record<Condition, { icon: string; label: string }> = {
  good: { icon: conditionGoodIcon, label: '괜찮아요' },
  hard: { icon: conditionHardIcon, label: '힘들어요' },
};

type ConditionCardProps = {
  condition: Condition;
};

/** Figma '컨디션 카드' — 오늘 고른 컨디션 표시 (1-1: 괜찮아요 / 1-2: 힘들어요) */
export function ConditionCard({ condition }: ConditionCardProps) {
  const { icon, label } = CONDITION_VIEW[condition];

  return (
    <div className="flex h-20 items-center gap-4 rounded-card border border-border bg-surface px-6 py-5">
      <img src={icon} alt="" width={23.5} height={23.5} className="size-[23.5px] shrink-0" />
      <p className="text-button text-text-main">
        <span className="sr-only">오늘의 컨디션: </span>
        {label}
      </p>
    </div>
  );
}
