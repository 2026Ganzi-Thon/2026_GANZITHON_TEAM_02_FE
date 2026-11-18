import { mockGoal } from '../mocks/data';
import type { DailyRecord, Goal, WeeklyPlan } from '../types';
import { kstTodayKey, todayKey } from '../utils/date';
import { USE_SUPABASE, supabase, toAppError } from '../utils/supabase';
import { createId, mockResponse } from './mockClient';

/* ---------------------------------------------------------
 * Supabase 매핑
 *  goals(status ACTIVE 1개) + goal_weeks(1~4주차) ↔ Goal
 *  daily_records ↔ DailyRecord
 * --------------------------------------------------------- */

type GoalWeekRow = { week_number: number; title: string; description: string | null };
type GoalRow = {
  id: number;
  title: string;
  description: string | null;
  started_at: string | null;
  goal_weeks: GoalWeekRow[] | null;
};
type DailyRecordRow = {
  goal_id: number;
  date: string;
  title: string | null;
  status: 'DONE' | 'REST' | null;
  feedback: 'MANAGEABLE' | 'BURDENSOME' | null;
};

const GOAL_COLUMNS = 'id, title, description, started_at, goal_weeks(week_number, title, description)';
const RECORD_COLUMNS = 'goal_id, date, title, status, feedback';

function goalFromRow(row: GoalRow): Goal {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? '',
    startDate: row.started_at ?? kstTodayKey(),
    weeklyPlans: [...(row.goal_weeks ?? [])]
      .sort((a, b) => a.week_number - b.week_number)
      .map((week) => ({
        week: week.week_number as WeeklyPlan['week'],
        theme: week.title,
        task: week.description ?? '',
      })),
  };
}

function weeksToRows(goalId: number, weeklyPlans: WeeklyPlan[]) {
  return weeklyPlans.map((plan) => ({
    goal_id: goalId,
    week_number: plan.week,
    title: plan.theme,
    description: plan.task,
  }));
}

const STATUS_TO_DB = { done: 'DONE', rest: 'REST', none: null } as const;
const STATUS_FROM_DB = { DONE: 'done', REST: 'rest' } as const;

function feedbackToDb(feedback: DailyRecord['feedback']): DailyRecordRow['feedback'] {
  if (feedback === 'okay' || feedback === 'MANAGEABLE') return 'MANAGEABLE';
  if (feedback === 'burden' || feedback === 'BURDENSOME') return 'BURDENSOME';
  return null;
}

function recordFromRow(row: DailyRecordRow): DailyRecord {
  return {
    goalId: String(row.goal_id),
    date: row.date,
    todayGoal: row.title ?? '',
    status: row.status ? STATUS_FROM_DB[row.status] : 'none',
    feedback: row.feedback === 'MANAGEABLE' ? 'okay' : row.feedback === 'BURDENSOME' ? 'burden' : undefined,
  };
}

async function fetchActiveGoal(): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select(GOAL_COLUMNS)
    .eq('status', 'ACTIVE')
    .maybeSingle<GoalRow>();
  if (error) throw toAppError(error, '목표를 불러오지 못했습니다.');
  return data ? goalFromRow(data) : null;
}

async function replaceWeeks(goalId: number, weeklyPlans: WeeklyPlan[]) {
  const removed = await supabase.from('goal_weeks').delete().eq('goal_id', goalId);
  if (removed.error) throw toAppError(removed.error, '주간 계획 저장에 실패했습니다.');
  if (weeklyPlans.length === 0) return;
  const inserted = await supabase.from('goal_weeks').insert(weeksToRows(goalId, weeklyPlans));
  if (inserted.error) throw toAppError(inserted.error, '주간 계획 저장에 실패했습니다.');
}

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
  if (USE_SUPABASE) return fetchActiveGoal();
  return mockResponse(goal);
}

/**
 * 2-1 → 2-2: 목표 문장으로 주간 계획 초안 요청 (지금은 고정 목업 반환)
 * TODO(BE/AI): Supabase 스키마에 AI 초안 생성 기능이 없어 Supabase 모드에서도 목업을 쓴다.
 */
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
export async function createGoal(input: GoalInput): Promise<Goal> {
  if (USE_SUPABASE) {
    // 사용자당 ACTIVE 목표는 1개 → 기존 목표를 먼저 종료
    const ended = await supabase.from('goals').update({ status: 'ENDED' }).eq('status', 'ACTIVE');
    if (ended.error) throw toAppError(ended.error, '목표 저장에 실패했습니다.');

    const { data, error } = await supabase
      .from('goals')
      .insert({
        title: input.title,
        description: input.description,
        status: 'ACTIVE',
        started_at: kstTodayKey(),
      })
      .select('id')
      .single<{ id: number }>();
    if (error) throw toAppError(error, '목표 저장에 실패했습니다.');

    await replaceWeeks(data.id, input.weeklyPlans);
    const created = await fetchActiveGoal();
    if (!created) throw new Error('목표 저장에 실패했습니다.');
    return created;
  }

  goal = { id: createId('goal'), startDate: todayKey(), ...input };
  saveGoalToStorage(goal);
  return mockResponse(goal);
}

/** 기존 목표의 제목·설명·주간 계획 수정 (시작일·기록은 그대로) */
export async function saveGoal(input: GoalInput): Promise<Goal> {
  if (USE_SUPABASE) {
    const current = await fetchActiveGoal();
    if (!current) return createGoal(input);

    const goalId = Number(current.id);
    const { error } = await supabase
      .from('goals')
      .update({ title: input.title, description: input.description })
      .eq('id', goalId);
    if (error) throw toAppError(error, '목표 저장에 실패했습니다.');

    await replaceWeeks(goalId, input.weeklyPlans);
    const saved = await fetchActiveGoal();
    if (!saved) throw new Error('목표 저장에 실패했습니다.');
    return saved;
  }

  goal = {
    id: goal?.id ?? createId('goal'),
    startDate: goal?.startDate ?? todayKey(),
    ...input,
  };
  saveGoalToStorage(goal);
  return mockResponse(goal);
}

export async function getDailyRecords(goalId: string): Promise<DailyRecord[]> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('daily_records')
      .select(RECORD_COLUMNS)
      .eq('goal_id', Number(goalId))
      .order('date', { ascending: true })
      .returns<DailyRecordRow[]>();
    if (error) throw toAppError(error, '기록을 불러오지 못했습니다.');
    return (data ?? []).map(recordFromRow);
  }

  return mockResponse(records.filter((record) => record.goalId === goalId));
}

/**
 * 오늘 실천했어요 / 오늘은 쉬어갈게요 / 완료 취소 / 오늘 목표 수정
 * Supabase: (goal_id, date) 기준 upsert. RLS상 오늘(KST) 기록만 등록·수정 가능.
 */
export async function saveDailyRecord(record: DailyRecord): Promise<DailyRecord> {
  if (USE_SUPABASE) {
    const status = STATUS_TO_DB[record.status];
    const { data, error } = await supabase
      .from('daily_records')
      .upsert(
        {
          goal_id: Number(record.goalId),
          date: record.date,
          title: record.todayGoal || null,
          status,
          // 피드백은 실천 완료일 때만 저장 가능 (DB check 제약)
          feedback: status === 'DONE' ? feedbackToDb(record.feedback) : null,
        },
        { onConflict: 'goal_id,date' },
      )
      .select(RECORD_COLUMNS)
      .single<DailyRecordRow>();
    if (error) throw toAppError(error, '기록 저장에 실패했습니다.');
    return recordFromRow(data);
  }

  records = [...records.filter((r) => !(r.goalId === record.goalId && r.date === record.date)), record];
  saveRecordsToStorage(records);
  return mockResponse(record);
}
