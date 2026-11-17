import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { MobileLayout } from '../layouts/MobileLayout';

/**
 * 인증이 필요한 라우트 (홈, 마이페이지, 메모, 지원 등)
 * - 미인증: 온보딩 화면으로 리다이렉트
 * - 온보딩 초기설정 미완료: 온보딩 설정 화면으로 이동
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuthStatus();

  if (status === 'loading') {
    return (
      <MobileLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-caption text-text-sub">불러오는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to={PATHS.onboarding} replace />;
  }

  if (status === 'needs_setup') {
    return <Navigate to={PATHS.onboardingSetup} replace />;
  }

  return <>{children}</>;
}

/**
 * 비로그인 전용 라우트 (온보딩 소개, 로그인)
 * - 이미 로그인되어 있고 설정 완료된 재이용자: 온보딩 생략하고 홈으로 직행
 * - 로그인되어 있으나 설정 미완료: 설정 화면으로 이동
 */
export function PublicOnly({ children }: { children: ReactNode }) {
  const status = useAuthStatus();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <Navigate to={PATHS.home} replace />;
  }

  if (status === 'needs_setup') {
    return <Navigate to={PATHS.onboardingSetup} replace />;
  }

  return <>{children}</>;
}

/**
 * 온보딩 설정 페이지 가드
 * - 미인증: 로그인으로 이동
 * - 이미 설정 완료: 홈으로 이동
 */
export function RequireSetup({ children }: { children: ReactNode }) {
  const status = useAuthStatus();

  if (status === 'loading') {
    return (
      <MobileLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-caption text-text-sub">설정 정보를 확인하는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to={PATHS.login} replace />;
  }

  if (status === 'authenticated') {
    return <Navigate to={PATHS.home} replace />;
  }

  return <>{children}</>;
}
