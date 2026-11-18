import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../layouts/MobileLayout';
import { Button } from '../components/Button';
import { PATHS } from '../routes/paths';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout
      bottom={
        <div className="flex flex-col gap-2.5 px-10 pb-8 pt-4">
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate(PATHS.home, { replace: true })}
          >
            홈으로 돌아가기
          </Button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="py-1 text-center text-caption text-text-sub underline underline-offset-2"
          >
            이전 화면으로 돌아가기
          </button>
        </div>
      }
    >
      <main className="flex flex-1 flex-col items-center justify-center px-10 text-center">
        {/* 귀여운 양 캐릭터와 배경 원 */}
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-primary-soft">
          <img
            src="/sheep.png"
            alt="길을 잃은 양 캐릭터"
            className="h-20 w-auto object-contain transition-transform hover:scale-105"
          />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-sm border border-border text-xs font-bold text-primary">
            ?
          </span>
        </div>

        {/* 안내 텍스트 */}
        <span className="mt-8 text-label text-primary">
          404 NOT FOUND
        </span>

        <h1 className="mt-2 text-title font-semibold text-text-main">
          길을 잃어버렸어요
        </h1>

        <p className="mt-3 text-caption text-text-sub leading-relaxed whitespace-pre-line">
          찾으시는 페이지의 주소가 잘못되었거나{'\n'}
          더 이상 존재하지 않는 화면이에요.{'\n'}
          홈으로 돌아가서 다시 시작해 볼까요?
        </p>
      </main>
    </MobileLayout>
  );
}