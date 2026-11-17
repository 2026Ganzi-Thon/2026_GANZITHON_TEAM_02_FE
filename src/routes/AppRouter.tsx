import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { TabLayout } from '../layouts/TabLayout';
import { PATHS } from './paths';

import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import GoalsPage from '../pages/GoalsPage';
import MemosPage from '../pages/MemosPage';
import SupportPage from '../pages/SupportPage';
import MyPage from '../pages/MyPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * 라우트는 레이아웃 기준으로 두 그룹으로 나눈다. 새 페이지는 반드시 둘 중 하나에 넣는다.
 *
 * 1) 탭 화면 (TabLayout: 공통 Header + 하단 내비)
 *    - Figma에서 하단 내비가 있는 화면만: 홈 / 메모 / 지원 / 내 정보
 *    - 페이지는 본문만 그린다 (MobileLayout·Header를 직접 쓰지 않음)
 *
 * 2) 단독 화면 (레이아웃 없음)
 *    - 하단 내비가 없는 화면: 100일 목표 설정, 온보딩·로그인·회원가입, 404 등
 *    - 페이지가 MobileLayout으로 자체 Header·하단 CTA 버튼을 직접 그린다
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1) 탭 화면: 공통 Header + 하단 내비 */}
        <Route element={<TabLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.memos} element={<MemosPage />} />
          <Route path={PATHS.support} element={<SupportPage />} />
          <Route path={PATHS.mypage} element={<MyPage />} />
        </Route>

        {/* 2) 단독 화면: 페이지가 MobileLayout을 직접 그림 */}
        <Route path={PATHS.goals} element={<GoalsPage />} />
        <Route path={PATHS.onboarding} element={<OnboardingPage />} />
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.signup} element={<SignupPage />} />

        {/* 존재하지 않는 경로 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
