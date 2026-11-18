import { mockGoal } from '../mocks/data';
import type { DailyRecord, Goal, WeeklyPlan } from '../types';
import { todayKey } from '../utils/date';
import { createId, mockResponse } from './mockClient';

const GOAL_STORAGE_KEY = 'ari_goal_mock';
const RECORDS_STORAGE_KEY = 'ari_records_mock';

function loadGoalFromStorage(): Goal | null {
  try {
    const saved = localStorage.getItem(GOAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return null;
}

function saveGoalToStorage(g: Goal | null) {
  try {
    if (g) localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(g));
    else localStorage.removeItem(GOAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function loadRecordsFromStorage(): DailyRecord[] {
  try {
    const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

function saveRecordsToStorage(recs: DailyRecord[]) {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(recs));
  } catch {
    // ignore
  }
}

// 기본 목표 없이 실제 사용자가 등록한 목표를 사용한다.
let goal: Goal | null = loadGoalFromStorage();
let records: DailyRecord[] = loadRecordsFromStorage();

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

type GoalInput = { title: string; description: string; weeklyPlans: WeeklyPlan[] };

/**
 * 2-2 '이 계획으로 시작하기': 새 100일 목표를 만든다. 시작일 = 오늘(기기 시간), 1일 째부터 다시 센다.
 * (toISOString은 UTC라 한국 시간 새벽 0~9시에 하루 전 날짜가 되므로 todayKey를 쓴다)
 */
export function createGoal(input: GoalInput): Promise<Goal> {
  goal = { id: createId('goal'), startDate: todayKey(), ...input };
  saveGoalToStorage(goal);
  return mockResponse(goal);
}

/** 기존 목표의 제목·설명·주간 계획 수정 (시작일·기록은 그대로) */
export function saveGoal(input: GoalInput): Promise<Goal> {
  goal = {
    id: goal?.id ?? createId('goal'),
    startDate: goal?.startDate ?? todayKey(),
    ...input,
  };
  saveGoalToStorage(goal);
  return mockResponse(goal);
}

export function getDailyRecords(goalId: string): Promise<DailyRecord[]> {
  return mockResponse(records.filter((record) => record.goalId === goalId));
}

/** 오늘 실천했어요 / 오늘은 쉬어갈게요 / 완료 취소 */
export function saveDailyRecord(record: DailyRecord): Promise<DailyRecord> {
  records = [...records.filter((r) => !(r.goalId === record.goalId && r.date === record.date)), record];
  saveRecordsToStorage(records);
  return mockResponse(record);
}
