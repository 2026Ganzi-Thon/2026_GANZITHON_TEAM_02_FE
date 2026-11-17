export type LoginStep = 'login' | 'profile';
export type NextStep = 'INITIAL_SETUP' | 'HOME';

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type KakaoLoginData = AuthTokens & {
  is_new_user: boolean;
  next_step: NextStep;
  user: {
    user_id: number;
    nickname: string | null;
  };
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
};

export type KakaoAuthResult =
  | { authorization_code: string }
  | { kakao_access_token: string };