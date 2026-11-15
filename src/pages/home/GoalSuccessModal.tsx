import successSheep from '../../assets/home/success-sheep.svg';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Modal } from '../../components/Modal';
import type { DailyRecord } from '../../types';

type Feedback = NonNullable<DailyRecord['feedback']>;

const FEEDBACK_OPTIONS: { value: Feedback; label: string }[] = [
  { value: 'okay', label: '이 정도면 괜찮아요' },
  { value: 'burden', label: '아직 부담돼요' },
];

type GoalSuccessModalProps = {
  open: boolean;
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
export function GoalSuccessModal({ open, feedback, onFeedbackChange, onClose, onUndo }: GoalSuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="오늘의 털 한 칸을 채웠어요!" description="작게 시작한 것도 내가 해낸 일이에요.">
      {/* TODO(Should): 양털판(100칸)을 실제 기록으로 그리기 전까지 Figma 이미지를 그대로 사용 */}
      <img src={successSheep} alt="" width={276} height={228} className="mx-auto h-[228px] w-[276px] max-w-full" />

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
