import { useEffect, useState } from 'react';
import { createMemo, deleteMemo, getMemos, updateMemo } from '../../api/memo';
import { BottomActionArea } from '../../components/BottomActionArea';
import { Button } from '../../components/Button';
import { PageTitle } from '../../components/PageTitle';
import type { Memo } from '../../types';
import { MemoCard } from './MemoCard';
import { MemoDetailModal } from './MemoDetailModal';
import { NewMemoModal } from './NewMemoModal';
import type { SheepTone } from './SheepShape';

/** 카드 색은 하얀 양 → 갈색 양 → 핑크 양 순서로 반복 (Figma 3-1) */
const TONES: SheepTone[] = ['white', 'beige', 'pink'];

/**
 * Figma 3-1 비공개 메모장 (144:1060)
 * 헤더·하단 내비는 라우터 레이아웃(팀원B)이 그린다고 보고, 이 컴포넌트는 본문만 그린다.
 * 메모 내용은 민감정보라 console·URL에 남기지 않는다.
 */
export function MemoPage() {
  const [memos, setMemos] = useState<Memo[] | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [selected, setSelected] = useState<Memo | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getMemos().then((list) => {
      if (!ignore) setMemos(list);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const refresh = async () => setMemos(await getMemos());

  const run = async (task: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await task();
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageTitle label="MY NOTE" title="나만의 메모장" description="정리되지 않은 생각도 괜찮아요. 지금 마음을 편하게 남겨보세요." />

      <section aria-label="메모 목록" className="mx-10 flex flex-col items-center gap-[10px] rounded-[10px] bg-surface-muted p-[10px]">
        {memos === null && <p className="py-10 text-caption text-text-sub">불러오는 중…</p>}
        {memos?.length === 0 && (
          // 빈 목록 화면은 Figma에 없음 → 임시 문구 (디자인 확인 필요)
          <p className="py-10 text-caption text-text-sub">아직 남긴 메모가 없어요.</p>
        )}
        {memos?.map((memo, index) => (
          <MemoCard key={memo.id} memo={memo} tone={TONES[index % TONES.length]} onOpen={setSelected} />
        ))}
      </section>

      <BottomActionArea>
        <Button fullWidth onClick={() => setNewOpen(true)}>
          새로운 메모 적기
        </Button>
      </BottomActionArea>

      <NewMemoModal
        open={newOpen}
        saving={busy}
        onClose={() => setNewOpen(false)}
        onSave={(content) =>
          run(async () => {
            await createMemo(content);
            setNewOpen(false);
          })
        }
      />
      <MemoDetailModal
        memo={selected}
        busy={busy}
        onClose={() => setSelected(null)}
        onSave={(id, content) =>
          run(async () => {
            await updateMemo(id, content);
            setSelected(null);
          })
        }
        onDelete={(id) =>
          // Figma에 삭제 확인 팝업이 없어 바로 삭제 (확인 단계 추가 여부 디자인 확인 필요)
          run(async () => {
            await deleteMemo(id);
            setSelected(null);
          })
        }
      />
    </>
  );
}
