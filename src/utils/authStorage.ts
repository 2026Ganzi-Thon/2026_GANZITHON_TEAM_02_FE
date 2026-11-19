const TOKEN_STORAGE_KEY = 'ari_access_token';
const AUTH_USER_KEY = 'ari_auth_user';

export interface StoredAuthUser {
  userId: number;
  authUserId: string;
  loginProvider: string;
  isNewUser: boolean;
  initialSetupCompleted: boolean;
}

// Supabase / Mock 액세스 토큰 저장
export function saveAccessToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Supabase / Mock 액세스 토큰 조회
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// 인증 사용자 정보 저장
export function saveAuthUser(user: StoredAuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// 인증 사용자 정보 조회
export function getStoredAuthUser(): StoredAuthUser | null {
  const stored = localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as StoredAuthUser;
  } catch {
    return null;
  }
}

// 인증 세션 초기화 (로그아웃 / 탈퇴 시)
export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

// 로그인 여부 확인
export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
