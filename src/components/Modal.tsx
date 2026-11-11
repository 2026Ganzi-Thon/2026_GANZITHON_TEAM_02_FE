import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** 팝업 하단 버튼 영역. 보통 <ModalActions /> */
  footer?: ReactNode;
  children?: ReactNode;
};

/**
 * Figma '오늘 목표 수정 팝업', '주간 계획 수정 팝업', '메모 팝업' 등의 공통 틀.
 * 2026-11-10 디자인 확정: X 버튼 없이 하단 '취소' 버튼으로 닫는다 (Figma ver1).
 * 배경 클릭·Esc로도 닫힌다.
 */
export function Modal({ open, onClose, title, description, footer, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // 부모가 다시 렌더링될 때마다 onClose가 새 함수가 되어도 아래 effect가 다시 돌지 않도록 ref로 보관한다.
  // (effect가 다시 돌면 포커스가 팝업 틀로 옮겨져 입력 중이던 글자가 끊기는 문제가 있었음)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    // 팝업이 열릴 때 한 번만 포커스를 옮긴다
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-main/40 px-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-[322px] flex-col gap-2 rounded-card border border-primary-pressed bg-surface-warm px-6 py-4 text-left focus:outline-none"
      >
        <h2 id={titleId} className="text-section text-text-main">
          {title}
        </h2>
        {description && <p className="text-caption text-text-sub">{description}</p>}
        {children}
        {footer && <div className="pt-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

type ModalActionsProps = {
  onConfirm: () => void;
  confirmLabel?: string;
  /** 취소 버튼 (팝업을 닫는 유일한 버튼이므로 필수) */
  onCancel: () => void;
  cancelLabel?: string;
  confirmDisabled?: boolean;
};

/**
 * Figma '팝업 액션 영역' — 취소 / 확인 버튼.
 * 버튼이 하나뿐인 팝업(예: 오늘 목표 성공 팝업의 '대시보드로 돌아가기')은 footer에 <Button fullWidth size="lg" />를 직접 넣는다.
 */
export function ModalActions({
  onConfirm,
  confirmLabel = '수정하기',
  onCancel,
  cancelLabel = '취소',
  confirmDisabled = false,
}: ModalActionsProps) {
  return (
    <div className="flex gap-[18px]">
      <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button size="md" className="flex-1" onClick={onConfirm} disabled={confirmDisabled}>
        {confirmLabel}
      </Button>
    </div>
  );
}
