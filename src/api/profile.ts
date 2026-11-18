import { mockProfile } from '../mocks/data';
import type { Profile, UpdateProfilePayload } from '../types';
import { getAccessToken, getStoredAuthUser, saveAuthUser } from '../utils/authStorage';
import { mockResponse } from './mockClient';

/**
 * 사용자 프로필 API 모듈.
 * 백엔드(Supabase / REST API) 완성 시 이 파일 내부 함수들만 실제 API 호출로 교체합니다.
 *
 * 명세서 기준:
 * - GET /api/users/me/profile: 내 프로필 조회
 * - PUT /api/users/me/profile: 프로필 수정 (닉네임, 지역, 관심 분야)
 */

const STORAGE_KEY = 'ari_user_profile_mock';

export const DEFAULT_REGION = '서울특별시 중구';

function loadProfileFromStorage(): Profile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    ...mockProfile,
    userId: 1,
    user_id: 1,
    nickname: '',
    region: '',
    interests: [],
    initialSetupCompleted: false,
    initial_setup_completed: false,
  };
}

function saveProfileToStorage(profile: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

let profileState: Profile = loadProfileFromStorage();

/** 프로필 조회 (GET /api/users/me/profile) */
export async function getProfile(): Promise<Profile> {
  const token = getAccessToken();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  if (!useMock && apiBaseUrl && token) {
    const res = await fetch(`${apiBaseUrl}/api/users/me/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error('프로필을 불러오지 못했습니다.');
    const json = await res.json();
    return json.data;
  }

  const isCompleted = profileState.initialSetupCompleted ?? profileState.initial_setup_completed ?? false;
  const region = profileState.region?.trim() || (isCompleted ? DEFAULT_REGION : '');

  return mockResponse({
    ...profileState,
    region,
    userId: profileState.userId ?? profileState.user_id ?? 1,
    user_id: profileState.user_id ?? profileState.userId ?? 1,
    initialSetupCompleted: isCompleted,
    initial_setup_completed: isCompleted,
  });
}

/** 프로필 수정 및 초기설정 완료 (PUT /api/users/me/profile) */
export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const token = getAccessToken();
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  const isUndecided = payload.interest_undecided ?? payload.interestUndecided ?? false;
  const finalRegion = payload.region !== undefined
    ? (payload.region?.trim() || DEFAULT_REGION)
    : (profileState.region?.trim() || DEFAULT_REGION);

  if (!useMock && apiBaseUrl && token) {
    const res = await fetch(`${apiBaseUrl}/api/users/me/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: payload.nickname,
        region: finalRegion,
        interests: isUndecided ? [] : payload.interests ?? [],
        interest_undecided: isUndecided,
      }),
    });
    if (!res.ok) throw new Error('프로필 저장에 실패했습니다.');
    const json = await res.json();
    return json.data;
  }

  const interests = isUndecided ? [] : (payload.interests ?? profileState.interests);

  profileState = {
    ...profileState,
    nickname: payload.nickname.trim(),
    region: finalRegion,
    interests,
    initialSetupCompleted: true,
    initial_setup_completed: true,
  };

  saveProfileToStorage(profileState);

  // StoredAuthUser도 동기화
  const storedAuth = getStoredAuthUser();
  if (storedAuth) {
    saveAuthUser({
      ...storedAuth,
      initialSetupCompleted: true,
    });
  }

  return mockResponse(profileState);
}
