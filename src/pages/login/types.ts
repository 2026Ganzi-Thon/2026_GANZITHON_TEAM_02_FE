export type LoginStep = 'login' | 'profile';
export type NextStep = 'INITIAL_SETUP' | 'HOME';

export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
};

export type AuthMeData = {
  user_id: number;
  auth_user_id: string;
  login_provider: string;
  is_new_user: boolean;
  initial_setup_completed: boolean;
  next_step: NextStep;
};

export type ProfileData = {
  user_id: number;
  nickname: string | null;
  region: string | null;
  interests: string[];
  initial_setup_completed: boolean;
  login_provider: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type KakaoAuthResult =
  | { authorization_code: string }
  | { kakao_access_token: string };
