import { mockProfile } from '../mocks/data';
import type { Profile, UpdateProfilePayload } from '../types';
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

function loadProfileFromStorage(): Profile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return { ...mockProfile };
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
export function getProfile(): Promise<Profile> {
  // TODO(Supabase/API): 실제 연동 시 아래 주석 예시처럼 교체
  // const res = await fetch('/api/users/me/profile');
  // const json = await res.json();
  // return json.data;
  return mockResponse(profileState);
}

/** 프로필 수정 (PUT /api/users/me/profile) */
export function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  // TODO(Supabase/API): 실제 연동 시 아래 주석 예시처럼 교체
  // const res = await fetch('/api/users/me/profile', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // const json = await res.json();
  // return json.data;

  const interests = payload.interestUndecided ? [] : (payload.interests ?? profileState.interests);

  profileState = {
    ...profileState,
    nickname: payload.nickname.trim(),
    region: payload.region !== undefined ? (payload.region?.trim() || null) : profileState.region,
    interests,
  };

  saveProfileToStorage(profileState);

  return mockResponse(profileState);
}
