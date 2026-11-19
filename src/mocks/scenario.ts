import type { Goal, WeeklyPlan } from '../types';

/**
 * 하드코딩 데이터 시나리오 (노션 기획 > 하드코딩 데이터 시나리오, 2026-11-19).
 * 심사 시연이 오프라인에서도 동작해야 해서 AI 없이 고정 문구로 계획을 바꾼다.
 * 입력 문장과 상관없이 아래 기준으로 결과를 보여준다.
 *  - 기본: 처음 목표 입력 시
 *  - 경우 1: 100일 목표 수정 → 1~4주차 전부 변경
 *  - 경우 2: 주간 계획 N주차 수정 → N~4주차 변경 (N주차 할 일은 사용자가 쓴 문장 그대로)
 *  - 경우 3: 오늘 목표 성공 팝업에서 '아직 부담돼요' → 계획을 가볍게 변경
 */

type Week = WeeklyPlan['week'];
type GoalPlan = Pick<Goal, 'description' | 'weeklyPlans'>;

const plans = (rows: [theme: string, task: string][]): WeeklyPlan[] =>
  rows.map(([theme, task], index) => ({ week: (index + 1) as Week, theme, task }));

/** 기본 시나리오 (처음 목표 입력 시) */
export const BASE_PLAN: GoalPlan = {
  description: '일정한 시간에 일어나고,\n짧게라도 공부하는 일상을 만들어요.',
  weeklyPlans: plans([
    ['아침 리듬 만들기', '아침 9시에 일어나기'],
    ['몸 깨우기', '일어나서 10분 산책하기'],
    ['공부 습관 시작하기', '20분 검정고시 공부하기'],
    ['일상으로 굳히기', '기상·산책·공부 이어가기'],
  ]),
};

/** 경우 1 — 100일 목표 수정 */
export const GOAL_EDIT_PLAN: GoalPlan = {
  description: '매일 같은 시간 책상에 앉고,\n조금씩 공부 시간을 늘려가요.',
  weeklyPlans: plans([
    ['공부 자리 만들기', '책상에 10분 앉아 있기'],
    ['기초 다지기', '30분 국어·수학 기초 공부하기'],
    ['공부 시간 늘리기', '1시간 과목별 공부하기'],
    ['실전 감각 익히기', '기출문제 1회분 풀기'],
  ]),
};

/** 경우 2 — N주차를 고쳤을 때 N~4주차 결과 (N주차 할 일은 사용자 입력으로 덮어씀) */
export const WEEKLY_EDIT_PLANS: Record<Week, WeeklyPlan[]> = {
  1: plans([
    ['내 속도로 일어나기', '아침 10시에 일어나기'],
    ['가볍게 몸 깨우기', '일어나서 5분 스트레칭하기'],
    ['짧게 공부해보기', '10분 검정고시 공부하기'],
    ['내 리듬 이어가기', '기상·스트레칭·공부 이어가기'],
  ]),
  2: plans([
    ['', ''],
    ['저녁 산책하기', '저녁에 20분 걷기'],
    ['걷고 나서 공부하기', '걷고 온 날 20분 공부하기'],
    ['하루 루틴 완성하기', '기상·저녁 산책·공부 이어가기'],
  ]).slice(1),
  3: plans([
    ['', ''],
    ['', ''],
    ['영어 공부 시작하기', '20분 영어 단어 외우기'],
    ['공부 루틴 굳히기', '기상·산책·영어 공부 이어가기'],
  ]).slice(2),
  4: [{ week: 4, theme: '한 주 돌아보기', task: '주말에 한 주 돌아보기' }],
};

/** 경우 3 — '아직 부담돼요' */
export const BURDEN_PLANS: WeeklyPlan[] = plans([
  ['천천히 시작하기', '아침 10시에 일어나기'],
  ['가볍게 움직이기', '일어나서 5분 스트레칭하기'],
  ['조금씩 공부하기', '10분 검정고시 공부하기'],
  ['내 속도로 이어가기', '할 수 있는 만큼 루틴 이어가기'],
]);

/** 경우 1: 100일 목표 제목이 바뀌면 설명·1~4주차를 시나리오대로 바꾼다 */
export function applyGoalTitleEdit<T extends Pick<Goal, 'title' | 'description' | 'weeklyPlans'>>(
  current: T,
  title: string,
): T {
  if (title === current.title) return current;
  return { ...current, title, ...GOAL_EDIT_PLAN };
}

/**
 * 경우 2: 가장 앞에서 바뀐 주차 N 기준으로 N~4주차를 시나리오대로 바꾼다.
 * N주차 할 일은 사용자가 입력한 문장을 그대로 쓰고, 앞 주차는 그대로 둔다.
 */
export function applyWeeklyPlanEdit(current: WeeklyPlan[], edited: WeeklyPlan[]): WeeklyPlan[] {
  const changed = edited.find((plan) => current.find((prev) => prev.week === plan.week)?.task !== plan.task);
  if (!changed) return current;

  const scenario = new Map(WEEKLY_EDIT_PLANS[changed.week].map((plan) => [plan.week, plan]));
  return current.map((plan) => {
    if (plan.week < changed.week) return plan;
    const next = scenario.get(plan.week) ?? plan;
    return plan.week === changed.week ? { ...next, task: changed.task } : next;
  });
}

/** 목표 시작일 기준 오늘이 몇 주차인지 (1~7일 = 1주차, 22일 이후 = 4주차) */
export function currentWeek(dayNumber: number): Week {
  return Math.min(4, Math.max(1, Math.ceil(dayNumber / 7))) as Week;
}
