/**
 * 도메인 타입 (목업 기준 초안).
 * 백엔드(Supabase) 스키마가 정해지면 맞춰서 수정한다. docs/FUNCTION_SPEC.md 5장과 같은 내용.
 */

/** 괜찮아요 / 힘들어요 */
export type Condition = 'good' | 'hard';

export type ConditionLog = {
  date: string; // YYYY-MM-DD
  condition: Condition | 'skipped';
};

export type WeeklyPlan = {
  week: 1 | 2 | 3 | 4;
  theme: string; // 습관 만들기
  task: string; // 아침 9시 기상
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  weeklyPlans: WeeklyPlan[];
};

/** 실천 / 쉬어감 / 기록 없음 */
export type DayStatus = 'done' | 'rest' | 'none';

export type DailyRecord = {
  goalId: string;
  date: string; // YYYY-MM-DD
  todayGoal: string;
  status: DayStatus;
  /** 이 정도면 괜찮아요 / 아직 부담돼요 */
  feedback?: 'okay' | 'burden';
};

/** 홈 타이틀용 사용자 정보 (초기 설정·프로필 API가 정해지면 맞춘다) */
export type Profile = {
  nickname: string;
};

export type Memo = {
  id: string;
  content: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
