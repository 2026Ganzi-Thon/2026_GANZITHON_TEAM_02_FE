import { mockMemos } from '../mocks/data';
import type { Memo } from '../types';
import { createId, mockResponse } from './mockClient';

const MEMO_STORAGE_KEY = 'ari_memos_mock';

function loadMemosFromStorage(): Memo[] {
  try {
    const saved = localStorage.getItem(MEMO_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return [...mockMemos];
}

function saveMemosToStorage(data: Memo[]) {
  try {
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

let memos: Memo[] = loadMemosFromStorage();

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
  saveMemosToStorage(memos);
  return mockResponse(memo);
}

export function updateMemo(id: string, content: string): Promise<Memo | undefined> {
  const now = new Date().toISOString();
  memos = memos.map((memo) => (memo.id === id ? { ...memo, content, updatedAt: now } : memo));
  saveMemosToStorage(memos);
  return mockResponse(memos.find((memo) => memo.id === id));
}

export function deleteMemo(id: string): Promise<void> {
  memos = memos.filter((memo) => memo.id !== id);
  saveMemosToStorage(memos);
  return mockResponse(undefined);
}
