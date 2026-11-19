/**
 * 도메인 타입 (API 명세서 기준).
 * docs/FUNCTION_SPEC.md 및 아리톤 API 명세서(Supabase + 카카오 연동 수정본) 참조.
 */

/** 괜찮아요 / 힘들어요 */
export type Condition = 'good' | 'hard';
export type ConditionApiEnum = 'OK' | 'HARD';

/** 필요한 도움 5종 */
export type HelpType =
  | 'SMALL_GOAL'
  | 'MEMO'
  | 'PROGRAM'
  | 'COUNSELING'
  | 'REST';

export type ConditionLog = {
  date: string; // YYYY-MM-DD
  condition: Condition | 'skipped';
  helpType?: HelpType | null;
};

export type WeeklyPlan = {
  week: 1 | 2 | 3 | 4;
  theme: string; // 주차별 고정 주제 (WEEK_THEMES: 시작하기 / 익숙해지기 / 늘려가기 / 이어가기)
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
  feedback?: 'okay' | 'burden' | 'MANAGEABLE' | 'BURDENSOME';
};

/** 프로필 정보 (초기 설정 및 마이페이지 프로필 API 연동용) */
export type Profile = {
  userId?: number;
  user_id?: number;
  nickname: string;
  region: string | null;
  interests: string[];
  initialSetupCompleted?: boolean;
  initial_setup_completed?: boolean;
  loginProvider?: 'KAKAO' | 'NAVER' | string;
  login_provider?: string;
};

/** 프로필 수정 요청 Body (PUT /api/users/me/profile) */
export type UpdateProfilePayload = {
  nickname: string;
  region?: string | null;
  interests?: string[];
  interest_undecided?: boolean;
  interestUndecided?: boolean;
};

/** GET /api/auth/me 응답 데이터 */
export type AuthMeData = {
  user_id: number;
  auth_user_id: string;
  login_provider: string;
  is_new_user: boolean;
  initial_setup_completed: boolean;
  next_step: 'INITIAL_SETUP' | 'HOME';
};

/** 오늘 컨디션 API 응답 데이터 */
export type TodayConditionData = {
  date: string;
  condition: ConditionApiEnum | null;
  help_type: HelpType | null;
};

export type Memo = {
  id: string;
  content: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
