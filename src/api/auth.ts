import type { AuthMeData } from '../pages/login/types';
import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  saveAccessToken,
  saveAuthUser,
} from '../utils/authStorage';
import { PATHS } from '../routes/paths';
import { USE_SUPABASE, isSupabaseConfigured, supabase, toAppError } from '../utils/supabase';
import { mockResponse } from './mockClient';
import { DEFAULT_REGION, getProfile, updateProfile } from './profile';

/**
 * 카카오 OAuth + Supabase Auth 로그인 함수.
 * Supabase가 연동되어 있다면 signInWithOAuth를 실행하여 카카오 소셜 로그인을 시작하고,
 * Supabase 미연동 환경이거나 Mock 테스트 시에는 가상 세션을 생성합니다.
 */
export async function signInWithKakao(options?: {
  isNewUser?: boolean;
  forceMock?: boolean;
}): Promise<AuthMeData | void> {
  if (USE_SUPABASE && !options?.forceMock) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}${PATHS.authCallback}`,
        scopes: 'profile_nickname profile_image',
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
 * 로그인 사용자 확인 + 초기 설정 여부.
 * Supabase: 세션 사용자 + profiles(로그인 시 트리거로 자동 생성) 조회. 닉네임이 있으면 초기 설정 완료.
 */
export async function getAuthMe(): Promise<AuthMeData> {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      clearAuthSession();
      throw new Error('로그인 정보가 없습니다.');
    }
    // 토큰이 갱신됐을 수 있으므로 최신 access_token으로 맞춰 둔다
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.access_token) saveAccessToken(sessionData.session.access_token);

    const profile = await getProfile();
    const completed = Boolean(profile.initial_setup_completed);
    return {
      user_id: 0, // Supabase는 uuid(auth_user_id)로 사용자를 식별한다
      auth_user_id: data.user.id,
      login_provider: 'KAKAO',
      is_new_user: !completed,
      initial_setup_completed: completed,
      next_step: completed ? 'HOME' : 'INITIAL_SETUP',
    };
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인 정보가 없습니다.');
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
 * 회원 탈퇴.
 * Supabase: 클라이언트(anon key)로는 auth.users 삭제 권한이 없어서
 * 본인 데이터(목표·기록·메모)를 지우고 프로필을 초기화한 뒤 로그아웃한다.
 * TODO(BE): 계정 자체 삭제가 필요하면 security definer RPC 또는 Edge Function 필요
 */
export async function withdrawUser(): Promise<void> {
  if (USE_SUPABASE) {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (userId) {
      // goals 삭제 시 goal_weeks, daily_records는 FK cascade로 함께 삭제됨
      const goals = await supabase.from('goals').delete().eq('user_id', userId);
      if (goals.error) throw toAppError(goals.error, '회원 탈퇴 처리에 실패했습니다.');
      const memos = await supabase.from('memos').delete().eq('user_id', userId);
      if (memos.error) throw toAppError(memos.error, '회원 탈퇴 처리에 실패했습니다.');
      const profile = await supabase
        .from('profiles')
        .update({ nickname: null, region: null, interests: [], interest_undecided: false })
        .eq('id', userId);
      if (profile.error) throw toAppError(profile.error, '회원 탈퇴 처리에 실패했습니다.');
    }
  }

  await signOut();
  return mockResponse(undefined, 200);
}

/**
 * 초기 설정 건너뛰기: 닉네임만 저장하고 지역은 기본값, 관심 분야는 비워 둔다.
 */
export async function skipOnboarding(payload?: {
  nickname?: string;
  region?: string;
  interests?: string[];
}): Promise<void> {
  if (USE_SUPABASE) {
    const current = await getProfile();
    await updateProfile({
      nickname: payload?.nickname ?? (current.nickname || '이름 없음'),
      region: payload?.region ?? current.region ?? DEFAULT_REGION,
      interests: payload?.interests ?? [],
    });
    return;
  }

  // Mock: 프로필에 초기 설정 완료 플래그는 false 유지하고 홈 진입 허용
  const current = await getProfile();
  await updateProfile({
    nickname: payload?.nickname ?? current.nickname ?? '이름 없음',
    region: payload?.region ?? current.region,
    interests: payload?.interests ?? [],
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
