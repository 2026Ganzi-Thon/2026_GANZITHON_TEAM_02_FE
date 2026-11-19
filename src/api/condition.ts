import type { ConditionLog, HelpType } from '../types';
import { kstTodayKey, todayKey } from '../utils/date';
import { USE_SUPABASE, supabase, toAppError } from '../utils/supabase';
import { mockResponse } from './mockClient';

type ConditionRow = {
  date: string;
  condition: 'OK' | 'HARD';
  help_type: HelpType | null;
};

const CONDITION_COLUMNS = 'date, condition, help_type';

function fromRow(row: ConditionRow): ConditionLog {
  return {
    date: row.date,
    condition: row.condition === 'OK' ? 'good' : 'hard',
    helpType: row.help_type,
  };
}

/** Supabase: 오늘(KST) 내 컨디션 행. RLS로 본인 것만 조회된다 */
async function fetchTodayConditionRow(): Promise<ConditionRow | null> {
  const { data, error } = await supabase
    .from('conditions')
    .select(CONDITION_COLUMNS)
    .eq('date', kstTodayKey())
    .maybeSingle<ConditionRow>();
  if (error) throw toAppError(error, '컨디션을 조회하지 못했습니다.');
  return data;
}

const STORAGE_KEY = 'ari_today_condition_mock';

type StoredConditionState = {
  date: string;
  condition: 'good' | 'hard' | 'skipped' | null;
  apiCondition: 'OK' | 'HARD' | null;
  helpType: HelpType | null;
};

function loadConditionFromStorage(): StoredConditionState {
  const today = todayKey();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: StoredConditionState = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    date: today,
    condition: null,
    apiCondition: null,
    helpType: null,
  };
}

function saveConditionToStorage(state: StoredConditionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

let conditionState: StoredConditionState = loadConditionFromStorage();

/** 오늘 기록한 컨디션 조회 */
export async function getTodayCondition(): Promise<ConditionLog | null> {
  if (USE_SUPABASE) {
    const row = await fetchTodayConditionRow();
    if (row) return fromRow(row);
    // '건너뛰기'는 DB에 저장하지 않으므로 이 기기에서 건너뛴 기록만 로컬에서 확인
    const local = loadConditionFromStorage();
    return local.condition === 'skipped' ? { date: local.date, condition: 'skipped', helpType: null } : null;
  }

  // 로컬/날짜 확인
  const today = todayKey();
  if (conditionState.date !== today) {
    conditionState = {
      date: today,
      condition: null,
      apiCondition: null,
      helpType: null,
    };
    saveConditionToStorage(conditionState);
  }

  if (!conditionState.condition) {
    return mockResponse(null);
  }

  return mockResponse({
    date: conditionState.date,
    condition: conditionState.condition,
    helpType: conditionState.helpType,
  });
}

/**
 * 오늘 컨디션 저장 (하루 1회, 재선택 불가 — DB unique(user_id, date))
 * @param condition 'good' / 'OK' (괜찮아요) 또는 'hard' / 'bad' / 'HARD' (힘들어요)
 */
export async function saveTodayCondition(
  condition: 'good' | 'hard' | 'bad' | 'OK' | 'HARD' | 'skipped',
): Promise<ConditionLog> {
  const isGood = condition === 'good' || condition === 'OK';
  const isSkipped = condition === 'skipped';
  const clientCondition: 'good' | 'hard' | 'skipped' = isSkipped
    ? 'skipped'
    : isGood
      ? 'good'
      : 'hard';
  const apiCondition: 'OK' | 'HARD' = isGood ? 'OK' : 'HARD';

  if (USE_SUPABASE && !isSkipped) {
    const { data, error } = await supabase
      .from('conditions')
      .insert({ condition: apiCondition })
      .select(CONDITION_COLUMNS)
      .single<ConditionRow>();
    if (error) {
      // 23505: 오늘 이미 기록함 (재선택 불가) → 기존 기록을 그대로 돌려준다
      if (error.code === '23505') {
        const existing = await fetchTodayConditionRow();
        if (existing) return fromRow(existing);
      }
      throw toAppError(error, '컨디션 저장에 실패했습니다.');
    }
    return fromRow(data);
  }

  conditionState = {
    date: todayKey(),
    condition: clientCondition,
    apiCondition: isSkipped ? null : apiCondition,
    helpType: isGood ? null : conditionState.helpType,
  };
  saveConditionToStorage(conditionState);

  return mockResponse({
    date: conditionState.date,
    condition: clientCondition,
    helpType: conditionState.helpType,
  });
}

/**
 * 선택한 도움 저장 ('힘들어요'일 때만 가능)
 * @param helpType 'SMALL_GOAL' | 'MEMO' | 'PROGRAM' | 'COUNSELING' | 'REST'
 */
export async function saveTodayHelp(helpType: HelpType): Promise<ConditionLog> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('conditions')
      .update({ help_type: helpType })
      .eq('date', kstTodayKey())
      .select(CONDITION_COLUMNS)
      .maybeSingle<ConditionRow>();
    if (error) throw toAppError(error, '도움 저장에 실패했습니다.');
    if (!data) throw new Error('오늘 컨디션을 먼저 선택해 주세요.');
    return fromRow(data);
  }

  conditionState = {
    ...conditionState,
    date: todayKey(),
    helpType,
  };
  saveConditionToStorage(conditionState);

  return mockResponse({
    date: conditionState.date,
    condition: conditionState.condition ?? 'hard',
    helpType,
  });
}
