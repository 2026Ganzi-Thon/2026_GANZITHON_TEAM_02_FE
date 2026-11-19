import { mockProfile } from '../mocks/data';
import type { Profile, UpdateProfilePayload } from '../types';
import { getStoredAuthUser, saveAuthUser } from '../utils/authStorage';
import { USE_SUPABASE, getCurrentUserId, supabase, toAppError } from '../utils/supabase';
import { mockResponse } from './mockClient';

/**
 * 사용자 프로필 API 모듈.
 * - Supabase: public.profiles (auth.users와 1:1, 로그인 시 트리거로 자동 생성 → update만 사용)
 * - 목업: localStorage
 *
 * 초기 설정 완료 여부는 별도 컬럼이 없으므로 '닉네임이 저장되어 있는지'로 판단한다.
 */

type ProfileRow = {
  id: string;
  nickname: string | null;
  region: string | null;
  interests: string[] | null;
  interest_undecided: boolean;
};

function fromRow(row: ProfileRow): Profile {
  const completed = Boolean(row.nickname?.trim());
  return {
    nickname: row.nickname ?? '',
    region: row.region,
    interests: row.interests ?? [],
    initialSetupCompleted: completed,
    initial_setup_completed: completed,
    loginProvider: 'KAKAO',
    login_provider: 'KAKAO',
  };
}

const PROFILE_COLUMNS = 'id, nickname, region, interests, interest_undecided';

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

/** 내 프로필 조회 */
export async function getProfile(): Promise<Profile> {
  if (USE_SUPABASE) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .maybeSingle<ProfileRow>();
    if (error) throw toAppError(error, '프로필을 불러오지 못했습니다.');
    if (!data) {
      // 트리거로 생성되기 전 등 예외 상황: 빈 프로필로 취급 (초기 설정 필요)
      return fromRow({ id: userId, nickname: null, region: null, interests: [], interest_undecided: false });
    }
    return fromRow(data);
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

/** 프로필 수정 및 초기설정 완료 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const isUndecided = payload.interest_undecided ?? payload.interestUndecided ?? false;
  const finalRegion = payload.region !== undefined
    ? (payload.region?.trim() || DEFAULT_REGION)
    : (profileState.region?.trim() || DEFAULT_REGION);

  if (USE_SUPABASE) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('profiles')
      .update({
        nickname: payload.nickname.trim(),
        // region을 안 보낸 경우 기존 값 유지
        ...(payload.region !== undefined && { region: payload.region?.trim() || DEFAULT_REGION }),
        ...((isUndecided || payload.interests !== undefined) && {
          interests: isUndecided ? [] : payload.interests ?? [],
        }),
        interest_undecided: isUndecided,
      })
      .eq('id', userId)
      .select(PROFILE_COLUMNS)
      .single<ProfileRow>();
    if (error) throw toAppError(error, '프로필 저장에 실패했습니다.');
    return fromRow(data);
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
