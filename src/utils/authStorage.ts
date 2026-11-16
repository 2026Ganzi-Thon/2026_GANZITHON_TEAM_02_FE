import type { AuthTokens } from '../pages/login/types';

const TOKEN_STORAGE_KEY = 'auth_tokens';

// 인증 토큰 저장
// TODO: 백엔드와 토큰 저장 정책 확정 후 변경
export function saveAuthTokens(data: AuthTokens) {
  sessionStorage.setItem(
    TOKEN_STORAGE_KEY,
    JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    }),
  );
}

// 인증 토큰 조회
export function getAccessToken(): string | null {
  const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);

  if (!stored) return null;

  try {
    const tokens: AuthTokens = JSON.parse(stored);
    return tokens.access_token;
  } catch {
    return null;
  }
}