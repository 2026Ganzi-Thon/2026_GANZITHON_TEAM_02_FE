import { HomeDashboard } from './home/HomeDashboard';

/**
 * / — 홈 대시보드 (Figma 1-1 / 1-2).
 * 탭 화면: TabLayout이 Header·하단 내비를 그리므로 HomeDashboard는 본문만 그린다.
 */
export default function HomePage() {
  return <HomeDashboard />;
}
