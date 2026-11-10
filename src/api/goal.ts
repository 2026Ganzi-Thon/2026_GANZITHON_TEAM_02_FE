import { mockDailyRecords, mockGoal } from '../mocks/data';
import type { DailyRecord, Goal, WeeklyPlan } from '../types';
import { createId, mockResponse } from './mockClient';

// TODO(Supabase): 아래 함수들의 내부를 Supabase 쿼리로 교체. 함수 이름·반환 타입은 유지한다.
// TODO(AI): 주간 계획 초안은 백엔드에서 생성. 프론트에서 AI API 키를 사용하지 않는다.
let goal: Goal | null = mockGoal;
let records: DailyRecord[] = [...mockDailyRecords];

export function getGoal(): Promise<Goal | null> {
  return mockResponse(goal);
}

/** 2-1 → 2-2: 목표 문장으로 주간 계획 초안 요청 (지금은 고정 목업 반환) */
export function requestWeeklyPlanDraft(title: string): Promise<Pick<Goal, 'title' | 'description' | 'weeklyPlans'>> {
  return mockResponse(
    { title, description: mockGoal.description, weeklyPlans: mockGoal.weeklyPlans },
    800,
  );
}

export function saveGoal(input: { title: string; description: string; weeklyPlans: WeeklyPlan[] }): Promise<Goal> {
  goal = {
    id: goal?.id ?? createId('goal'),
    startDate: goal?.startDate ?? new Date().toISOString().slice(0, 10),
    ...input,
  };
  return mockResponse(goal);
}

export function getDailyRecords(goalId: string): Promise<DailyRecord[]> {
  return mockResponse(records.filter((record) => record.goalId === goalId));
}

/** 오늘 실천했어요 / 오늘은 쉬어갈게요 / 완료 취소 */
export function saveDailyRecord(record: DailyRecord): Promise<DailyRecord> {
  records = [...records.filter((r) => !(r.goalId === record.goalId && r.date === record.date)), record];
  return mockResponse(record);
}
