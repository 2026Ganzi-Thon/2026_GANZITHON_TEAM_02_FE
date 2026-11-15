import { cn } from '../../utils/cn';
import { SheepBoard } from './SheepBoard';
import type { SheepDay } from './sheepDays';

type LegendKey = 'done' | 'rest' | 'today' | 'none';

const LEGEND: { key: LegendKey; label: string }[] = [
  { key: 'done', label: '실천' },
  { key: 'rest', label: '쉬어감' },
  { key: 'today', label: '오늘' },
  { key: 'none', label: '기록 없음' },
];

/** 범례 동그라미 14.8px (Figma 95:446) */
function LegendDot({ kind }: { kind: LegendKey }) {
  const isToday = kind === 'today';
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-[14.8px] shrink-0 overflow-visible">
      <circle
        cx={8}
        cy={8}
        r={isToday ? 7 : 7.5}
        strokeWidth={isToday ? 2 : 1}
        className={cn(
          isToday ? 'fill-surface stroke-primary-pressed' : 'stroke-border',
          kind === 'done' && 'fill-surface',
          kind === 'rest' && 'fill-surface-warm',
          kind === 'none' && 'fill-background',
        )}
      />
      {kind === 'rest' && <line x1={5.4} x2={10.6} y1={8} y2={8} strokeWidth={1} className="stroke-wool-rest" />}
    </svg>
  );
}

type SheepProgressSectionProps = {
  /** 목표 시작일 기준 오늘이 몇 일째인지 */
  dayNumber: number;
  days: SheepDay[];
};

/** Figma 1-1 '양털 영역'(95:428): 한 칸씩 내 속도로 + N일 째 + 100칸 양털판 + 범례 (GL-11) */
export function SheepProgressSection({ dayNumber, days }: SheepProgressSectionProps) {
  return (
    <section className="flex flex-col gap-2 px-10 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-section text-text-main">한 칸씩 내 속도로</h2>
        <span className="rounded-chip bg-primary-soft px-[7px] py-0.5 text-caption font-bold text-primary-pressed">
          {dayNumber}일 째
        </span>
      </div>
      <SheepBoard days={days} />
      <ul className="flex items-center justify-center gap-2 py-[5px]" aria-label="양털판 범례">
        {LEGEND.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-caption text-text-sub">
            <LegendDot kind={item.key} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
