import type { DailyRecord, Goal, Memo } from '../types';

/**
 * Supabase 연동 전 임시 목업 데이터.
 * 화면에서 직접 import하지 말고 src/api 함수를 통해서만 사용한다.
 * 문구는 Figma 와이어프레임 예시를 그대로 사용했다.
 */

export const mockGoal: Goal = {
  id: 'goal-1',
  title: '나에게 맞는 생활 리듬 만들기',
  description: '일정한 시간에 일어나고, 짧게라도 공부하는 일상을 만들어요.',
  startDate: '2026-10-01',
  weeklyPlans: [
    { week: 1, theme: '습관 만들기', task: '아침 9시 기상' },
    { week: 2, theme: '체력 기르기', task: '운동 주 3회하기' },
    { week: 3, theme: '공부 시작하기', task: '검정고시 공부하기' },
    { week: 4, theme: '공부', task: '수능 공부하기' },
  ],
};

export const mockDailyRecords: DailyRecord[] = [
  { goalId: 'goal-1', date: '2026-11-07', todayGoal: '아침 9시 기상', status: 'rest' },
  { goalId: 'goal-1', date: '2026-11-08', todayGoal: '아침 9시 기상', status: 'rest' },
  { goalId: 'goal-1', date: '2026-11-09', todayGoal: '아침 9시 기상', status: 'done', feedback: 'okay' },
];

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
];
