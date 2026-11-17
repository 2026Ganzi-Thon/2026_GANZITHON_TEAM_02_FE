import type { ConditionLog, HelpType } from '../types';
import { todayKey } from '../utils/date';
import { getAccessToken } from '../utils/authStorage';
import { mockResponse } from './mockClient';

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

/** 오늘 기록한 컨디션 조회 (GET /api/conditions/today) */
export async function getTodayCondition(): Promise<ConditionLog | null> {
  const token = getAccessToken();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  if (!useMock && apiBaseUrl && token) {
    const res = await fetch(`${apiBaseUrl}/api/conditions/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error('컨디션을 조회하지 못했습니다.');
    const json = await res.json();
    const data = json.data;
    if (!data || !data.condition) return null;
    return {
      date: data.date,
      condition: data.condition === 'OK' ? 'good' : 'hard',
      helpType: data.help_type,
    };
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
 * 오늘 컨디션 저장 (PUT /api/conditions/today)
 * @param condition 'good' / 'OK' (괜찮아요) 또는 'hard' / 'bad' / 'HARD' (힘들어요)
 */
export async function saveTodayCondition(
  condition: 'good' | 'hard' | 'bad' | 'OK' | 'HARD' | 'skipped',
): Promise<ConditionLog> {
  const token = getAccessToken();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  const isGood = condition === 'good' || condition === 'OK';
  const isSkipped = condition === 'skipped';
  const clientCondition: 'good' | 'hard' | 'skipped' = isSkipped
    ? 'skipped'
    : isGood
      ? 'good'
      : 'hard';
  const apiCondition: 'OK' | 'HARD' = isGood ? 'OK' : 'HARD';

  if (!useMock && apiBaseUrl && token && !isSkipped) {
    const res = await fetch(`${apiBaseUrl}/api/conditions/today`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condition: apiCondition }),
    });
    if (!res.ok) throw new Error('컨디션 저장에 실패했습니다.');
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
 * 선택한 도움 저장 (PUT /api/conditions/today/help)
 * @param helpType 'SMALL_GOAL' | 'MEMO' | 'PROGRAM' | 'COUNSELING' | 'REST'
 */
export async function saveTodayHelp(helpType: HelpType): Promise<ConditionLog> {
  const token = getAccessToken();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  if (!useMock && apiBaseUrl && token) {
    const res = await fetch(`${apiBaseUrl}/api/conditions/today/help`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ help_type: helpType }),
    });
    if (!res.ok) throw new Error('도움 저장에 실패했습니다.');
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
