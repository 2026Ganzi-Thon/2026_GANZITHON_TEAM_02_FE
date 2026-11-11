import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav, type BottomNavKey } from '../components/BottomNav';
import { Header } from '../components/Header';
import { PATHS } from '../routes/paths';
import { MobileLayout } from './MobileLayout';

/** 하단 내비 탭 ↔ 경로 (Figma 하단 내비게이션 4개 탭) */
const TAB_PATHS: Record<BottomNavKey, string> = {
  home: PATHS.home,
  memo: PATHS.memos,
  support: PATHS.support,
  my: PATHS.mypage,
};

/**
 * 탭 화면 공통 레이아웃: 공통 Header + 하단 내비게이션.
 * Figma에서 하단 내비가 있는 화면(홈 / 메모 / 지원 / 내 정보)에만 쓴다.
 * 이 레이아웃 안의 페이지는 본문만 그린다 (자체 MobileLayout·Header 금지).
 */
export function TabLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = (Object.keys(TAB_PATHS) as BottomNavKey[]).find((key) => TAB_PATHS[key] === pathname);

  return (
    <MobileLayout header={<Header />} bottom={<BottomNav active={active} onNavigate={(key) => navigate(TAB_PATHS[key])} />}>
      <Outlet />
    </MobileLayout>
  );
}
