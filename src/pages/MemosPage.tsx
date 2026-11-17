import { MemoPage } from './memo/MemoPage';

/**
 * /memos — 비공개 메모장 (Figma 3-1).
 * 탭 화면: TabLayout이 Header·하단 내비를 그리므로 MemoPage는 본문만 그린다.
 */
export default function MemosPage() {
  return <MemoPage />;
}
