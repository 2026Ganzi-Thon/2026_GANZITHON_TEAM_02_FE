import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { MobileLayout } from '../layouts/MobileLayout';

import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import GoalsPage from '../pages/GoalsPage';
import MemosPage from '../pages/MemosPage';
import SupportPage from '../pages/SupportPage';
import MyPage from '../pages/MyPage';
import NotFoundPage from '../pages/NotFoundPage';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 온보딩 및 인증 */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 메인 서비스 */}
        <Route element={
            <MobileLayout 
                header={<Header/>} 
                bottom={<BottomNav/>}
            >
                <Outlet/>
            </MobileLayout>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/memos" element={<MemosPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        {/* 존재하지 않는 경로 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}