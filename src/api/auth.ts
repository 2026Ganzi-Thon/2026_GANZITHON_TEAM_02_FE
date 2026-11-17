import type {
  ApiResponse,
  KakaoAuthResult,
  KakaoLoginData,
  ProfileData,
} from '../pages/login/types';

import { getAccessToken } from '../utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// API 관련 함수

// 백엔드 로그인 API
export async function loginWithKakao(
  authResult: KakaoAuthResult,
): Promise<KakaoLoginData> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/kakao/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...authResult,
        platform: 'WEB',
      }),
    },
  );

  if (!response.ok) {
    throw new Error('카카오 로그인에 실패했어요.');
  }

  const result: ApiResponse<KakaoLoginData> =
    await response.json();

  if (!result.success) {
    throw new Error('로그인 처리에 실패했어요.');
  }

  return result.data;
}

// 인증이 필요한 API 요청
async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('로그인 정보가 없어요.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

// 프로필 조회
export async function getProfile(): Promise<ProfileData> {
  const response = await authenticatedFetch(
    '/api/users/me/profile',
  );

  if (!response.ok) {
    throw new Error('프로필을 불러오지 못했어요.');
  }

  const result: ApiResponse<ProfileData> =
    await response.json();

  if (!result.success) {
    throw new Error('프로필 조회에 실패했어요.');
  }

  return result.data;
}

// 프로필 저장
export async function updateProfile(data: {
  nickname: string;
  region: string | null;
  interests: string[];
  interest_undecided: boolean;
}): Promise<ProfileData> {
  const response = await authenticatedFetch(
    '/api/users/me/profile',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('프로필 저장에 실패했어요.');
  }

  const result: ApiResponse<ProfileData> =
    await response.json();

  if (!result.success) {
    throw new Error('프로필 저장에 실패했어요.');
  }

  return result.data;
}

// 초기 설정 건너뛰기
export async function skipOnboarding(): Promise<void> {
  const response = await authenticatedFetch(
    '/api/users/me/onboarding/skip',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    throw new Error('건너뛰기 처리에 실패했어요.');
  }

  const result: ApiResponse<{
    initial_setup_completed: boolean;
    next_step: 'HOME';
  }> = await response.json();

  if (!result.success) {
    throw new Error('건너뛰기 처리에 실패했어요.');
  }
}