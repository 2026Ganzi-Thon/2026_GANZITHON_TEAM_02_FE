import { useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import { GoalSettingPage } from './goal/GoalSettingPage';

/**
 * /goals — 100일 목표 설정 (Figma 2-1 → 2-2).
 * 단독 화면: GoalSettingPage가 자체 Header와 하단 CTA 버튼을 그린다 (공통 탭 레이아웃 밖).
 */
export default function GoalsPage() {
  const navigate = useNavigate();

  // TODO(인증): 비회원이면 저장 시 로그인으로 보내는 처리는 인증 구현 때 추가 (USER_FLOW.md '로그인 시점')
  return <GoalSettingPage onComplete={() => navigate(PATHS.home)} />;
}
