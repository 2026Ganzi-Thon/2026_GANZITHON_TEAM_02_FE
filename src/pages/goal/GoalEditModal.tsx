import { useState } from 'react';
import { Modal, ModalActions } from '../../components/Modal';
import { TextField } from '../../components/TextField';

type GoalEditModalProps = {
  open: boolean;
  /** 지금 목표 문장. 팝업을 열 때 입력 필드에 채워 둔다 */
  title: string;
  onClose: () => void;
  onSave: (title: string) => void;
};

/** Figma '목표 수정 팝업' (180:10881) */
export function GoalEditModal({ open, title, onClose, onSave }: GoalEditModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="목표 수정하기" description="내가 바라는 변화에 맞게 고쳐주세요.">
      {/* 열 때마다 새로 마운트해서 입력값을 현재 목표로 초기화한다 */}
      {open && <GoalEditForm initialTitle={title} onClose={onClose} onSave={onSave} />}
    </Modal>
  );
}

function GoalEditForm({
  initialTitle,
  onClose,
  onSave,
}: {
  initialTitle: string;
  onClose: () => void;
  onSave: (title: string) => void;
}) {
  const [value, setValue] = useState(initialTitle);
  const trimmed = value.trim();

  return (
    <>
      <TextField
        tone="default"
        aria-label="100일 목표"
        placeholder="예) 나에게 맞는 생활 리듬 만들기"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="pt-4">
        <ModalActions onCancel={onClose} onConfirm={() => onSave(trimmed)} confirmDisabled={!trimmed} />
      </div>
    </>
  );
}
