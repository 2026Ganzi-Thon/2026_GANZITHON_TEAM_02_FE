import { useEffect, useState } from 'react';
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

/** 팝업1(털 채우기 전)을 보여주는 시간 */
const FILLING_DURATION_MS = 1200;

const TITLE = '오늘의 털 한 칸을 채웠어요!';
const DESCRIPTION = '작게 시작한 것도 내가 해낸 일이에요.';

/**
 * 오늘 목표 성공 팝업.
 * 1) Figma '오늘 목표 성공 팝업1' (118:3113): 오늘 칸이 아직 비어 있는 양 → 잠시 후(또는 탭) 2로 넘어감
 * 2) Figma '오늘 목표 성공 팝업2' (159:3449): 오늘 칸이 채워진 양 + 피드백 + 버튼
 *
 * 열릴 때마다 팝업1부터 시작하도록, 부모에서 열 때마다 key를 바꿔 다시 마운트한다.
 */
export function GoalSuccessModal(props: GoalSuccessModalProps) {
  const [step, setStep] = useState<'filling' | 'filled'>('filling');

  useEffect(() => {
    if (!props.open || step !== 'filling') return;
    const timer = window.setTimeout(() => setStep('filled'), FILLING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [props.open, step]);

  if (step === 'filling') {
    // 오늘 칸만 '채우기 전'(빈 칸 + 빨간 테두리)으로 보여준다
    const beforeFill = props.days.map((day) => (day.isToday ? { ...day, status: 'none' as const } : day));
    return (
      <Modal
        open={props.open}
        // 기록은 이미 저장됐으므로 배경 클릭·Esc는 팝업2로 넘긴다
        onClose={() => setStep('filled')}
        title={TITLE}
        description={DESCRIPTION}
        // Figma 118:3113: 높이 542px, 위아래 33px·좌우 22px, 내용 세로 가운데 정렬
        paddingClassName="px-[22px] py-[33px]"
        className="min-h-[542px] justify-center"
      >
        <button
          type="button"
          onClick={() => setStep('filled')}
          aria-label="다음"
          className="block focus-visible:outline-2 focus-visible:outline-primary-pressed"
        >
          <SheepBoard days={beforeFill} className="mx-auto max-w-[276px]" />
        </button>
      </Modal>
    );
  }

  return <GoalSuccessFilledModal {...props} />;
}

/**
 * Figma '오늘 목표 성공 팝업2' (159:3449).
 * 버튼이 하나인 팝업이라 ModalActions 대신 Button을 직접 둔다 (취소 버튼 없음, 배경 클릭·Esc로도 닫힘).
 */
function GoalSuccessFilledModal({ open, days, feedback, onFeedbackChange, onClose, onUndo }: GoalSuccessModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={TITLE}
      description={DESCRIPTION}
      // Figma 159:3449: 위아래 27px·좌우 22px. 줄 높이 차이 2px만큼 위아래를 1px씩 줄여 높이 542px에 맞춤
      paddingClassName="px-[22px] py-[26px]"
    >
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
