import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * 실제 Supabase 데이터를 쓸지 여부.
 * - Supabase URL·키가 있고 VITE_USE_MOCK !== 'true' 이면 Supabase 호출
 * - 그 외(키 없음, VITE_USE_MOCK=true)는 localStorage 목업
 */
export const USE_SUPABASE = isSupabaseConfigured && import.meta.env.VITE_USE_MOCK !== 'true';

/**
 * Supabase 클라이언트 인스턴스.
 * 환경 변수가 설정되지 않았을 경우 더미/폴백 클라이언트를 제공하여 런타임 에러를 방지합니다.
 */
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (createClient('https://mock-supabase.example.com', 'mock-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }) as SupabaseClient);

/** 현재 로그인한 Supabase 사용자 id(uuid). 세션이 없으면 에러 */
export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const userId = data.session?.user.id;
  if (!userId) throw new Error('로그인 정보가 없습니다.');
  return userId;
}

/** Supabase 에러를 화면에 보여줄 수 있는 Error로 변환 */
export function toAppError(error: { message?: string; code?: string } | null, fallback: string): Error {
  if (!error) return new Error(fallback);
  console.error('[Supabase]', error.code, error.message);
  return new Error(fallback);
}
