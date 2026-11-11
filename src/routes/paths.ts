/**
 * 화면 경로 모음. 화면 이동(Link, navigate)은 문자열 대신 이 상수를 쓴다.
 * 새 경로를 추가하면 AppRouter.tsx에서 어느 레이아웃 그룹에 넣을지도 함께 정한다.
 */
export const PATHS = {
  home: '/',
  goals: '/goals',
  memos: '/memos',
  support: '/support',
  mypage: '/mypage',
  onboarding: '/onboarding',
  login: '/login',
  signup: '/signup',
} as const;
