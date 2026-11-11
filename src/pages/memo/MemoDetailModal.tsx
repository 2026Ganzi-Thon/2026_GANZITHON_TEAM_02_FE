import { useState } from 'react';
import { Modal, ModalActions } from '../../components/Modal';
import type { Memo } from '../../types';
import { formatFullDateTime } from '../../utils/date';
import { SheepShape } from './SheepShape';

type MemoDetailModalProps = {
  /** 열어 둔 메모. null이면 팝업이 닫힌다 */
  memo: Memo | null;
  busy: boolean;
  onClose: () => void;
  onSave: (id: string, content: string) => void;
  onDelete: (id: string) => void;
};

/** Figma '메모 상세, 수정, 삭제 팝업' (207:781) */
export function MemoDetailModal({ memo, busy, onClose, onSave, onDelete }: MemoDetailModalProps) {
  return (
    <Modal
      open={memo !== null}
      onClose={onClose}
      title="그날의 내 마음"
      description={memo ? formatFullDateTime(memo.createdAt) : undefined}
    >
      {memo && <MemoDetailForm key={memo.id} memo={memo} busy={busy} onClose={onClose} onSave={onSave} onDelete={onDelete} />}
    </Modal>
  );
}

function MemoDetailForm({ memo, busy, onClose, onSave, onDelete }: Omit<MemoDetailModalProps, 'memo'> & { memo: Memo }) {
  const [content, setContent] = useState(memo.content);
  const trimmed = content.trim();

  return (
    <>
      {/* 말풍선 (Figma '메모 말풍선' 208:822) */}
      <div className="relative">
        <textarea
          aria-label="메모 내용"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="block h-[212px] w-full resize-none rounded-[20px] border border-border bg-surface px-4 py-2 text-caption text-text-main focus:outline-none focus:border-primary-pressed"
        />
        <span
          aria-hidden
          className="absolute -bottom-[7px] right-[38px] size-[14px] rotate-45 border-r border-b border-border bg-surface"
        />
      </div>
      <SheepShape tone="beige" className="mx-auto mt-4 h-[57px] w-[114px]" />
      <div className="pt-4 text-right">
        <button
          type="button"
          onClick={() => onDelete(memo.id)}
          disabled={busy}
          className="text-caption text-text-sub underline disabled:opacity-40"
        >
          삭제하기
        </button>
      </div>
      <ModalActions
        confirmLabel="저장하기"
        onCancel={onClose}
        onConfirm={() => onSave(memo.id, trimmed)}
        confirmDisabled={!trimmed || busy}
      />
    </>
  );
}
