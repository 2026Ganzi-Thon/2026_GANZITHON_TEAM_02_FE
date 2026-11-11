import { useState } from 'react';
import { Modal, ModalActions } from '../../components/Modal';
import { TextArea } from '../../components/TextArea';

type NewMemoModalProps = {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
};

/** Figma '신규 메모 입력 팝업' (207:756) */
export function NewMemoModal({ open, saving, onClose, onSave }: NewMemoModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="NEW NOTE" description="어떤 이야기든 좋아요. 떠오르는 대로 적어보세요.">
      {/* 입력값은 팝업 안에서만 관리한다 (열 때마다 빈 칸으로 시작) */}
      {open && <NewMemoForm saving={saving} onClose={onClose} onSave={onSave} />}
    </Modal>
  );
}

function NewMemoForm({ saving, onClose, onSave }: Omit<NewMemoModalProps, 'open'>) {
  const [content, setContent] = useState('');
  const trimmed = content.trim();

  return (
    <>
      <TextArea
        aria-label="메모 내용"
        // Figma 문구 그대로 (메모용 문구로 바꿀지 디자인 확인 필요)
        placeholder="예) 나에게 맞는 생활 리듬 만들기"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="pt-4">
        <ModalActions
          confirmLabel="저장하기"
          onCancel={onClose}
          onConfirm={() => onSave(trimmed)}
          confirmDisabled={!trimmed || saving}
        />
      </div>
    </>
  );
}
