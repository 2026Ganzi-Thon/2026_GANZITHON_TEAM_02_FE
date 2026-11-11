import type { Memo } from '../../types';
import { formatMonthDayTime } from '../../utils/date';
import { SheepShape, type SheepTone } from './SheepShape';

type MemoCardProps = {
  memo: Memo;
  tone: SheepTone;
  onOpen: (memo: Memo) => void;
};

/** Figma 3-1 메모 카드: 양 몸통 위에 작성 일시 + 본문 2줄 미리보기 */
export function MemoCard({ memo, tone, onOpen }: MemoCardProps) {
  const dateText = formatMonthDayTime(memo.createdAt);

  return (
    <button
      type="button"
      onClick={() => onOpen(memo)}
      aria-label={`${dateText} 메모 열기`}
      className="relative h-[133px] w-[265px] shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-pressed"
    >
      <SheepShape tone={tone} className="absolute inset-0 size-full" />
      <span className="absolute top-[27px] left-8 text-[8px] leading-[10px] text-text-sub">{dateText}</span>
      <span className="absolute top-[43px] left-8 line-clamp-2 w-[180px] text-[11px] leading-[19px] whitespace-pre-line text-text-main">
        {memo.content}
      </span>
    </button>
  );
}
