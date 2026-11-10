import { useState } from 'react';
import { BottomActionArea } from '../../components/BottomActionArea';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { PageTitle } from '../../components/PageTitle';
import { TextField } from '../../components/TextField';
import { MobileLayout } from '../../layouts/MobileLayout';

type GoalInputStepProps = {
  initialTitle?: string;
  /** 주간 계획 초안을 요청하는 중이면 true (버튼 비활성) */
  loading: boolean;
  onSubmit: (title: string) => void;
};

/** Figma 2-1 목표 설정 (85:964) */
export function GoalInputStep({ initialTitle = '', loading, onSubmit }: GoalInputStepProps) {
  const [title, setTitle] = useState(initialTitle);
  const trimmed = title.trim();

  return (
    <MobileLayout
      header={<Header />}
      bottom={
        <BottomActionArea helperText="내용은 언제든 다시 바꿀 수 있어요">
          <Button fullWidth disabled={!trimmed || loading} aria-busy={loading} onClick={() => onSubmit(trimmed)}>
            주간 계획 제안받기
          </Button>
        </BottomActionArea>
      }
    >
      <PageTitle
        label="100-DAY PLAN | 1/2"
        title="앞으로 어떤 일상을 만들고 싶나요?"
        description="거창하지 않아도 좋아요. 내가 바라는 작은 변화를 적어주세요."
      />
      <div className="px-10 pb-8">
        <TextField
          label="100일 동안 이어가고 싶은 목표"
          placeholder="예) 구름"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && trimmed && !loading && !event.nativeEvent.isComposing) onSubmit(trimmed);
          }}
        />
      </div>
    </MobileLayout>
  );
}
