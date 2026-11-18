import { mockMemos } from '../mocks/data';
import type { Memo } from '../types';
import { USE_SUPABASE, supabase, toAppError } from '../utils/supabase';
import { createId, mockResponse } from './mockClient';

type MemoRow = { id: number; content: string; created_at: string; updated_at: string };
const MEMO_COLUMNS = 'id, content, created_at, updated_at';

function fromRow(row: MemoRow): Memo {
  return { id: String(row.id), content: row.content, createdAt: row.created_at, updatedAt: row.updated_at };
}

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

export async function getMemos(): Promise<Memo[]> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('memos')
      .select(MEMO_COLUMNS)
      .order('created_at', { ascending: false })
      .returns<MemoRow[]>();
    if (error) throw toAppError(error, '메모를 불러오지 못했습니다.');
    return (data ?? []).map(fromRow);
  }

  const sorted = [...memos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return mockResponse(sorted);
}

export async function getMemo(id: string): Promise<Memo | undefined> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('memos')
      .select(MEMO_COLUMNS)
      .eq('id', Number(id))
      .maybeSingle<MemoRow>();
    if (error) throw toAppError(error, '메모를 불러오지 못했습니다.');
    return data ? fromRow(data) : undefined;
  }

  return mockResponse(memos.find((memo) => memo.id === id));
}

export async function createMemo(content: string): Promise<Memo> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('memos')
      .insert({ content })
      .select(MEMO_COLUMNS)
      .single<MemoRow>();
    if (error) throw toAppError(error, '메모 저장에 실패했습니다.');
    return fromRow(data);
  }

  const now = new Date().toISOString();
  const memo: Memo = { id: createId('memo'), content, createdAt: now, updatedAt: now };
  memos = [memo, ...memos];
  saveMemosToStorage(memos);
  return mockResponse(memo);
}

export async function updateMemo(id: string, content: string): Promise<Memo | undefined> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('memos')
      .update({ content })
      .eq('id', Number(id))
      .select(MEMO_COLUMNS)
      .maybeSingle<MemoRow>();
    if (error) throw toAppError(error, '메모 수정에 실패했습니다.');
    return data ? fromRow(data) : undefined;
  }

  const now = new Date().toISOString();
  memos = memos.map((memo) => (memo.id === id ? { ...memo, content, updatedAt: now } : memo));
  saveMemosToStorage(memos);
  return mockResponse(memos.find((memo) => memo.id === id));
}

export async function deleteMemo(id: string): Promise<void> {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('memos').delete().eq('id', Number(id));
    if (error) throw toAppError(error, '메모 삭제에 실패했습니다.');
    return;
  }

  memos = memos.filter((memo) => memo.id !== id);
  saveMemosToStorage(memos);
  return mockResponse(undefined);
}
