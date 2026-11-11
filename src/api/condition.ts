import { mockTodayCondition } from '../mocks/data';
import type { ConditionLog } from '../types';
import { todayKey } from '../utils/date';
import { mockResponse } from './mockClient';

// TODO(팀원B·Supabase): 컨디션 체크 화면의 저장 함수와 연결한다. 지금은 오늘 컨디션을 목업으로만 돌려준다.
// 함수 이름·반환 타입은 은빈님 저장 형태가 정해지면 함께 맞춘다.

/** 오늘 기록한 컨디션. 아직 체크하지 않았으면 null */
export function getTodayCondition(): Promise<ConditionLog | null> {
  return mockResponse({ date: todayKey(), condition: mockTodayCondition });
}
