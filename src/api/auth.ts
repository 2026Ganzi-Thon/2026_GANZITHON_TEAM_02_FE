import type { ApiResponse, AuthMeData } from '../pages/login/types';
import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  saveAccessToken,
  saveAuthUser,
} from '../utils/authStorage';
import { isSupabaseConfigured, supabase } from '../utils/supabase';
import { mockResponse } from './mockClient';
import { getProfile, updateProfile } from './profile';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

import { PATHS } from '../routes/paths';

/**
 * 카카오 OAuth + Supabase Auth 로그인 함수.
 * Supabase가 연동되어 있다면 signInWithOAuth를 실행하여 카카오 소셜 로그인을 시작하고,
 * Supabase 미연동 환경이거나 Mock 테스트 시에는 가상 세션을 생성합니다.
 */
export async function signInWithKakao(options?: {
  isNewUser?: boolean;
  forceMock?: boolean;
}): Promise<AuthMeData | void> {
  if (isSupabaseConfigured && !options?.forceMock) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}${PATHS.authCallback}`,
      },
    });
    if (error) throw error;
    return;
  }

  // Supabase 미구성 또는 Mock 테스트 시 가상 로그인 처리
  const isNew = options?.isNewUser ?? true;
  const mockToken = `mock-supabase-token-${Date.now()}`;
  saveAccessToken(mockToken);

  const authMe: AuthMeData = {
    user_id: 1,
    auth_user_id: '11111111-2222-4333-8444-555555555555',
    login_provider: 'KAKAO',
    is_new_user: isNew,
    initial_setup_completed: !isNew,
    next_step: isNew ? 'INITIAL_SETUP' : 'HOME',
  };

  saveAuthUser({
    userId: authMe.user_id,
    authUserId: authMe.auth_user_id,
    loginProvider: authMe.login_provider,
    isNewUser: authMe.is_new_user,
    initialSetupCompleted: authMe.initial_setup_completed,
  });

  return mockResponse(authMe, 400);
}

/**
 * GET /api/auth/me
 * Supabase 인증 사용자 확인 및 앱 사용자 등록/조회.
 */
export async function getAuthMe(): Promise<AuthMeData> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인 정보가 없습니다.');
  }

  if (!USE_MOCK && API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('인증 정보를 조회하지 못했습니다.');
    }

    const result = (await response.json()) as ApiResponse<AuthMeData>;
    return result.data;
  }

  // Mock 응답
  const stored = getStoredAuthUser();
  const currentProfile = await getProfile();

  const isCompleted = currentProfile.initial_setup_completed ?? false;

  const data: AuthMeData = {
    user_id: stored?.userId ?? 1,
    auth_user_id: stored?.authUserId ?? '11111111-2222-4333-8444-555555555555',
    login_provider: stored?.loginProvider ?? 'KAKAO',
    is_new_user: stored?.isNewUser ?? false,
    initial_setup_completed: isCompleted,
    next_step: isCompleted ? 'HOME' : 'INITIAL_SETUP',
  };

  return mockResponse(data, 200);
}

/**
 * 로그아웃 (Supabase Auth signOut + 로컬 세션 제거)
 */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }

  clearAuthSession();
  return mockResponse(undefined, 200);
}

/**
 * 회원 탈퇴 (DELETE /api/users/me)
 */
export async function withdrawUser(): Promise<void> {
  const token = getAccessToken();
  if (!USE_MOCK && API_BASE_URL && token) {
    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('회원 탈퇴 처리에 실패했습니다.');
    }
  }

  await signOut();
  return mockResponse(undefined, 200);
}

/**
 * 초기 설정 건너뛰기 (POST /api/users/me/onboarding/skip)
 */
export async function skipOnboarding(): Promise<void> {
  const token = getAccessToken();

  if (!USE_MOCK && API_BASE_URL && token) {
    const response = await fetch(`${API_BASE_URL}/api/users/me/onboarding/skip`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('건너뛰기 처리에 실패했어요.');
    }
    return;
  }

  // Mock: 프로필에 초기 설정 완료 플래그는 false 유지하고 홈 진입 허용
  const current = await getProfile();
  await updateProfile({
    nickname: current.nickname || '이름 없음',
    region: current.region,
    interests: current.interests,
  });

  const stored = getStoredAuthUser();
  if (stored) {
    saveAuthUser({
      ...stored,
      initialSetupCompleted: true, // 홈 화면 진입 가능하도록 설정
    });
  }

  return mockResponse(undefined, 200);
}
