import { useState, type ReactNode } from 'react';
import { BottomActionArea } from '../components/BottomActionArea';
import { BottomNav, type BottomNavKey } from '../components/BottomNav';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Header } from '../components/Header';
import { Modal, ModalActions } from '../components/Modal';
import { PageTitle } from '../components/PageTitle';
import { TextArea } from '../components/TextArea';
import { TextField } from '../components/TextField';
import { MobileLayout } from '../layouts/MobileLayout';

/**
 * 공통 컴포넌트 확인용 페이지 (개발 전용, /preview.html).
 * 라우터가 정해지기 전이라 App.tsx는 건드리지 않고 별도 진입점으로 둔다.
 */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-border px-10 py-6">
      <h2 className="text-caption text-text-sub">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentPreview() {
  const [tab, setTab] = useState<BottomNavKey>('home');
  const [goal, setGoal] = useState('');
  const [chip, setChip] = useState<'okay' | 'burden' | null>('okay');
  const [modal, setModal] = useState<'edit' | 'editClose' | 'memo' | null>(null);
  const [memo, setMemo] = useState('');

  return (
    <MobileLayout header={<Header />} bottom={<BottomNav active={tab} onNavigate={setTab} />}>
      <PageTitle label="100-DAY PLAN | 1/2" title="앞으로 어떤 일상을 만들고 싶나요?" description="거창하지 않아도 좋아요. 내가 바라는 작은 변화를 적어주세요." />

      <Section title="TextField (emphasis / default)">
        <TextField label="100일 동안 이어가고 싶은 목표" placeholder="예) 구름" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <TextField tone="default" placeholder="예) 나에게 맞는 생활 리듬 만들기" aria-label="팝업 입력 예시" />
      </Section>

      <Section title="Chip (md / sm)">
        <div className="flex gap-3">
          <Chip selected={chip === 'okay'} onClick={() => setChip('okay')} className="flex-1">
            이 정도면 괜찮아요
          </Chip>
          <Chip selected={chip === 'burden'} onClick={() => setChip('burden')} className="flex-1">
            아직 부담돼요
          </Chip>
        </div>
        <div className="flex gap-3">
          <Chip size="sm">검정고시</Chip>
          <Chip size="sm" selected>
            진로 체험
          </Chip>
        </div>
      </Section>

      <Section title="Button (lg / md, primary / secondary / disabled)">
        <Button fullWidth>오늘 실천했어요</Button>
        <Button fullWidth disabled>
          주간 계획 제안받기
        </Button>
        <div className="flex gap-[18px]">
          <Button variant="secondary" size="md" className="flex-1">
            취소
          </Button>
          <Button size="md" className="flex-1">
            수정하기
          </Button>
        </div>
      </Section>

      <Section title="Modal">
        <div className="flex flex-wrap gap-2">
          <Button size="md" variant="secondary" onClick={() => setModal('edit')}>
            ver1. 취소 버튼
          </Button>
          <Button size="md" variant="secondary" onClick={() => setModal('editClose')}>
            ver3. 취소 + X
          </Button>
          <Button size="md" variant="secondary" onClick={() => setModal('memo')}>
            메모 팝업
          </Button>
        </div>
      </Section>

      <Section title="Header (ver.이전)">
        <div className="-mx-10">
          <Header showBack onBack={() => undefined} right="로그인" />
        </div>
      </Section>

      <BottomActionArea helperText="내용은 언제든 다시 바꿀 수 있어요">
        <Button fullWidth>이 계획으로 시작하기</Button>
      </BottomActionArea>

      <Modal
        open={modal === 'edit' || modal === 'editClose'}
        onClose={() => setModal(null)}
        title="오늘의 목표 수정하기"
        description="내가 바라는 변화에 맞게 고쳐주세요."
        showCloseButton={modal === 'editClose'}
        footer={<ModalActions onCancel={() => setModal(null)} onConfirm={() => setModal(null)} />}
      >
        <TextField tone="default" placeholder="예) 나에게 맞는 생활 리듬 만들기" aria-label="오늘의 목표" />
      </Modal>

      <Modal
        open={modal === 'memo'}
        onClose={() => setModal(null)}
        title="NEW NOTE"
        description="어떤 이야기든 좋아요. 떠오르는 대로 적어보세요."
        footer={
          <ModalActions
            confirmLabel="저장하기"
            confirmDisabled={!memo.trim()}
            onCancel={() => setModal(null)}
            onConfirm={() => setModal(null)}
          />
        }
      >
        <TextArea placeholder="예) 나에게 맞는 생활 리듬 만들기" aria-label="메모 내용" value={memo} onChange={(e) => setMemo(e.target.value)} />
      </Modal>
    </MobileLayout>
  );
}
