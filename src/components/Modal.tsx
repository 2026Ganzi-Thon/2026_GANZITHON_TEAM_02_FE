import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { CloseIcon } from './icons';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** 오른쪽 위 X 버튼 표시 (Figma ver2·ver3) */
  showCloseButton?: boolean;
  /** 팝업 하단 버튼 영역. 보통 <ModalActions /> */
  footer?: ReactNode;
  children?: ReactNode;
};

/**
 * Figma '오늘 목표 수정 팝업', '주간 계획 수정 팝업', '메모 팝업' 등의 공통 틀.
 * 배경 클릭·Esc로 닫힌다.
 */
export function Modal({ open, onClose, title, description, showCloseButton = false, footer, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

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
        <div className="flex items-start justify-between gap-2">
          <h2 id={titleId} className="text-section text-text-main">
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="-mr-2 flex size-8 shrink-0 items-center justify-center text-text-main"
            >
              <CloseIcon />
            </button>
          )}
        </div>
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
  /** 없으면 취소 버튼을 숨기고 확인 버튼만 꽉 차게 표시 (Figma ver2) */
  onCancel?: () => void;
  cancelLabel?: string;
  confirmDisabled?: boolean;
};

/** Figma '팝업 액션 영역' — 취소 / 확인 버튼 */
export function ModalActions({
  onConfirm,
  confirmLabel = '수정하기',
  onCancel,
  cancelLabel = '취소',
  confirmDisabled = false,
}: ModalActionsProps) {
  return (
    <div className="flex gap-[18px]">
      {onCancel && (
        <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
      <Button size="md" className="flex-1" onClick={onConfirm} disabled={confirmDisabled}>
        {confirmLabel}
      </Button>
    </div>
  );
}
