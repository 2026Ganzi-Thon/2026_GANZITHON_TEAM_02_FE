import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Modal } from '../../components/Modal';
import type { DailyRecord } from '../../types';
import { SheepBoard } from './SheepBoard';
import type { SheepDay } from './sheepDays';

type Feedback = NonNullable<DailyRecord['feedback']>;

const FEEDBACK_OPTIONS: { value: Feedback; label: string }[] = [
  { value: 'okay', label: '이 정도면 괜찮아요' },
  { value: 'burden', label: '아직 부담돼요' },
];

type GoalSuccessModalProps = {
  open: boolean;
  /** 홈 양털판과 같은 100칸 데이터 (방금 채운 오늘 칸 포함) */
  days: SheepDay[];
  feedback?: Feedback;
  onFeedbackChange: (feedback: Feedback) => void;
  /** '대시보드로 돌아가기', 배경 클릭, Esc */
  onClose: () => void;
  /** '완료 취소' — 오늘 기록을 기록 전 상태로 되돌린다 */
  onUndo: () => void;
};

/**
 * Figma '오늘 목표 성공 팝업2' (159:3449).
 * 버튼이 하나인 팝업이라 ModalActions 대신 Button을 직접 둔다 (취소 버튼 없음, 배경 클릭·Esc로도 닫힘).
 */
export function GoalSuccessModal({ open, days, feedback, onFeedbackChange, onClose, onUndo }: GoalSuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="오늘의 털 한 칸을 채웠어요!" description="작게 시작한 것도 내가 해낸 일이에요.">
      {/* Figma는 예시 상태 이미지라, 홈과 같은 실제 기록으로 그린다 (276×228) */}
      <SheepBoard days={days} className="mx-auto max-w-[276px]" />

      <p className="flex items-baseline gap-1">
        <span className="text-section text-text-main">해보니 어땠나요?</span>
        <span className="text-caption text-text-sub">선택</span>
      </p>
      <div className="flex gap-[18px]" role="group" aria-label="해보니 어땠나요?">
        {FEEDBACK_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            size="sm"
            className="flex-1"
            selected={feedback === option.value}
            onClick={() => onFeedbackChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      <p className="text-caption text-text-sub">다음 목표의 분량을 정할 때 참고할게요.</p>

      <Button size="md" fullWidth onClick={onClose}>
        대시보드로 돌아가기
      </Button>
      <p className="text-caption text-text-sub">
        잘못 눌렀나요?{' '}
        <button type="button" onClick={onUndo} className="underline focus-visible:outline-2 focus-visible:outline-primary-pressed">
          완료 취소
        </button>
      </p>
    </Modal>
  );
}
