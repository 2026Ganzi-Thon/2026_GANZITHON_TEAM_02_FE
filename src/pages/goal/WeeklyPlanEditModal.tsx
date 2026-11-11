import { useState } from 'react';
import { Modal, ModalActions } from '../../components/Modal';
import { TextField } from '../../components/TextField';
import type { WeeklyPlan } from '../../types';

type WeeklyPlanEditModalProps = {
  open: boolean;
  plans: WeeklyPlan[];
  onClose: () => void;
  onSave: (plans: WeeklyPlan[]) => void;
};

/** Figma '주간 계획 수정 팝업' (180:12211) — 주차별 할 일만 고친다 (주제는 그대로) */
export function WeeklyPlanEditModal({ open, plans, onClose, onSave }: WeeklyPlanEditModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="주간 계획 수정하기" description="이번 4주의 계획을 내 상황에 맞게 바꿔주세요.">
      {open && <WeeklyPlanEditForm initialPlans={plans} onClose={onClose} onSave={onSave} />}
    </Modal>
  );
}

function WeeklyPlanEditForm({
  initialPlans,
  onClose,
  onSave,
}: {
  initialPlans: WeeklyPlan[];
  onClose: () => void;
  onSave: (plans: WeeklyPlan[]) => void;
}) {
  const [tasks, setTasks] = useState(() => initialPlans.map((plan) => plan.task));
  const hasEmpty = tasks.some((task) => !task.trim());

  const handleSave = () => {
    onSave(initialPlans.map((plan, index) => ({ ...plan, task: tasks[index].trim() })));
  };

  return (
    <>
      {initialPlans.map((plan, index) => (
        <div key={plan.week} className="flex flex-col gap-2">
          <label htmlFor={`weekly-plan-${plan.week}`} className="text-caption font-bold text-text-main">
            {plan.week}주차
          </label>
          <TextField
            id={`weekly-plan-${plan.week}`}
            tone="default"
            value={tasks[index]}
            onChange={(event) => {
              const next = [...tasks];
              next[index] = event.target.value;
              setTasks(next);
            }}
          />
        </div>
      ))}
      <div className="pt-4">
        <ModalActions onCancel={onClose} onConfirm={handleSave} confirmDisabled={hasEmpty} />
      </div>
    </>
  );
}
