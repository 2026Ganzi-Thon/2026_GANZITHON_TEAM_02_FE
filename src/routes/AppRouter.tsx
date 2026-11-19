import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { TabLayout } from '../layouts/TabLayout';
import { PATHS } from './paths';
import { RequireAuth, PublicOnly, RequireSetup } from './RouteGuard';

import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import GoalsPage from '../pages/GoalsPage';
import MemosPage from '../pages/MemosPage';
import SupportPage from '../pages/SupportPage';
import MyPage from '../pages/MyPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import NotFoundPage from '../pages/NotFoundPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import { OnboardingSetupPage } from '../pages/onboarding/OnboardingSetupPage';

import { ProgramDetailPage } from '../pages/support/ProgramDetailPage';

/**
 * 라우트는 레이아웃 기준으로 두 그룹으로 나눈다.
 *
 * 1) 탭 화면 (TabLayout: 공통 Header + 하단 내비)
 *    - Figma에서 하단 내비가 있는 화면만: 홈 / 메모 / 지원 / 내 정보
 *    - 로그인 및 초기 설정이 완료된 사용자만 접근 가능 (RequireAuth)
 *
 * 2) 단독 화면 (레이아웃 없음)
 *    - 온보딩 / 로그인 (PublicOnly: 이미 로그인 시 홈으로 생략)
 *    - 온보딩 설정 (RequireSetup: 로그인 후 미설정 사용자용)
 *    - 목표 설정, 프로필 수정 등
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1) 탭 화면: 공통 Header + 하단 내비 (로그인된 사용자 전용) */}
        <Route
          element={
            <RequireAuth>
              <TabLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.memos} element={<MemosPage />} />
          <Route path={PATHS.support} element={<SupportPage />} />
          <Route path={PATHS.mypage} element={<MyPage />} />
        </Route>

        {/* 2) 단독 화면 */}
        {/* 100일 목표 및 프로필 수정은 인증 사용자 전용 */}
        <Route
          path={PATHS.goals}
          element={
            <RequireAuth>
              <GoalsPage />
            </RequireAuth>
          }
        />
        <Route
          path={PATHS.mypageEdit}
          element={
            <RequireAuth>
              <ProfileEditPage />
            </RequireAuth>
          }
        />

        {/* 첫 방문자 온보딩 및 로그인 (이미 로그인된 재이용자는 홈으로 바로 이동) */}
        <Route
          path={PATHS.onboarding}
          element={
            <PublicOnly>
              <OnboardingPage />
            </PublicOnly>
          }
        />
        <Route
          path={PATHS.login}
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path={PATHS.signup}
          element={
            <PublicOnly>
              <SignupPage />
            </PublicOnly>
          }
        />

        {/* 온보딩 후 초기 설정 화면 */}
        <Route
          path={PATHS.onboardingSetup}
          element={
            <RequireSetup>
              <OnboardingSetupPage />
            </RequireSetup>
          }
        />

        {/* 카카오 OAuth 콜백 처리 화면 */}
        <Route path={PATHS.authCallback} element={<AuthCallbackPage />} />

        {/* 3) 세부 화면: 지원 탭 상세 */}
        <Route
          path="/support/programs/:programId"
          element={
            <RequireAuth>
              <ProgramDetailPage />
            </RequireAuth>
          }
        />

        {/* 존재하지 않는 경로 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
