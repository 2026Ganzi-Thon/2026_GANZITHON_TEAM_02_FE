import { mockProfile } from '../mocks/data';
import type { Profile } from '../types';
import { mockResponse } from './mockClient';

// TODO(팀원B·Supabase): 초기 설정에서 저장한 닉네임(프로필 API)과 연결한다. 지금은 목업 값.

export function getProfile(): Promise<Profile> {
  return mockResponse(mockProfile);
}
