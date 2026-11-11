import { useState } from 'react';
import { requestWeeklyPlanDraft, saveGoal } from '../../api/goal';
import type { Goal } from '../../types';
import { GoalInputStep } from './GoalInputStep';
import { GoalPlanStep, type GoalDraft } from './GoalPlanStep';

type GoalSettingPageProps = {
  /**
   * '이 계획으로 시작하기'로 저장이 끝나면 호출.
   * 라우터·로그인 처리는 팀원B 담당이라 여기서는 이동하지 않고 콜백만 둔다.
   * (비회원이면 로그인으로, 회원이면 홈으로 — USER_FLOW.md)
   */
  onComplete?: (goal: Goal) => void;
};

/** 100일 목표 설정: 2-1 목표 입력 → 2-2 주간 계획 확인 */
export function GoalSettingPage({ onComplete }: GoalSettingPageProps) {
  const [draft, setDraft] = useState<GoalDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleRequestDraft = async (title: string) => {
    setLoading(true);
    try {
      setDraft(await requestWeeklyPlanDraft(title));
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const goal = await saveGoal(draft);
      onComplete?.(goal);
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return <GoalInputStep loading={loading} onSubmit={handleRequestDraft} />;
  }

  return <GoalPlanStep draft={draft} onChange={setDraft} saving={saving} onStart={handleStart} />;
}
