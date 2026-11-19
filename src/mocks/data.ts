import type { ConditionLog, DailyRecord, Goal, Memo, Profile } from '../types';
import { BASE_PLAN } from './scenario';

/**
 * Supabase 연동 전 임시 목업 데이터.
 * 화면에서 직접 import하지 말고 src/api 함수를 통해서만 사용한다.
 * 문구는 Figma 와이어프레임 예시를 그대로 사용했다.
 */

export const mockGoal: Goal = {
  id: 'goal-1',
  title: '나에게 맞는 생활 리듬 만들기',
  // 문구는 하드코딩 데이터 시나리오의 기본 계획 (src/mocks/scenario.ts)
  ...BASE_PLAN,
  startDate: '2026-10-01',
};

export const mockDailyRecords: DailyRecord[] = [
  { goalId: 'goal-1', date: '2026-11-07', todayGoal: '아침 9시에 일어나기', status: 'rest' },
  { goalId: 'goal-1', date: '2026-11-08', todayGoal: '아침 9시에 일어나기', status: 'rest' },
  { goalId: 'goal-1', date: '2026-11-09', todayGoal: '아침 9시에 일어나기', status: 'done', feedback: 'okay' },
];

/** 프로필 정보 — 초기 설정 및 마이페이지 Figma 예시 값 사용 */
export const mockProfile: Profile = {
  userId: 1,
  nickname: '',
  region: '',
  interests: [],
  initialSetupCompleted: false,
  loginProvider: 'KAKAO',
};

/** 오늘의 컨디션 — 컨디션 체크 화면(팀원B)의 저장과 연결되기 전까지 임시 (getTodayCondition 참고) */
export const mockTodayCondition: ConditionLog['condition'] = 'good';

export const mockMemos: Memo[] = [
  {
    id: 'memo-1',
    content: '뭘 해야 할지 모르겠는 날.\n오늘은 그냥 쉬고 싶다.',
    createdAt: '2026-11-09T18:30:00+09:00',
    updatedAt: '2026-11-09T18:30:00+09:00',
  },
  {
    id: 'memo-2',
    content: '오늘은 고민이 많은 하루였다.',
    createdAt: '2026-11-08T21:10:00+09:00',
    updatedAt: '2026-11-08T21:10:00+09:00',
  },
  {
    id: 'memo-3',
    content: '산책을 하고 왔더니 조금 나아졌다.\n내일은 아침에 일어나 보기.',
    createdAt: '2026-11-07T09:20:00+09:00',
    updatedAt: '2026-11-07T09:20:00+09:00',
  },
];
