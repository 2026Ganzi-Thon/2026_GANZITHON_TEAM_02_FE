import { mockMemos } from '../mocks/data';
import type { Memo } from '../types';
import { createId, mockResponse } from './mockClient';

// TODO(Supabase): 아래 함수들의 내부를 Supabase 쿼리로 교체. 함수 이름·반환 타입은 유지한다.
let memos: Memo[] = [...mockMemos];

export function getMemos(): Promise<Memo[]> {
  const sorted = [...memos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return mockResponse(sorted);
}

export function getMemo(id: string): Promise<Memo | undefined> {
  return mockResponse(memos.find((memo) => memo.id === id));
}

export function createMemo(content: string): Promise<Memo> {
  const now = new Date().toISOString();
  const memo: Memo = { id: createId('memo'), content, createdAt: now, updatedAt: now };
  memos = [memo, ...memos];
  return mockResponse(memo);
}

export function updateMemo(id: string, content: string): Promise<Memo | undefined> {
  const now = new Date().toISOString();
  memos = memos.map((memo) => (memo.id === id ? { ...memo, content, updatedAt: now } : memo));
  return mockResponse(memos.find((memo) => memo.id === id));
}

export function deleteMemo(id: string): Promise<void> {
  memos = memos.filter((memo) => memo.id !== id);
  return mockResponse(undefined);
}
