import kakao from '../../assets/kakao.svg';

import sun from '../../assets/onboarding/sun.svg'
import pencil from '../../assets/onboarding/pencil.svg'
import search from '../../assets/onboarding/search.svg'

type LoginStepProps = {
  onKakaoLogin: () => void;
  submitting: boolean;
  error: string;
};

const features = [
  {
    icon: sun,
    text: '오늘의 컨디션에 맞는 작은 목표',
  },
  {
    icon: pencil,
    text: '편하게 마음을 남기는 나만의 메모장',
  },
  {
    icon: search,
    text: '내 주변 프로그램과 상담 기관 찾기',
  },
];

export function LoginStep({
  onKakaoLogin,
  submitting,
  error,
}: LoginStepProps) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-background px-6 py-8">
      <div className="flex w-full max-w-[340px] flex-col items-center">
        <img
          src="/sheep.png"
          alt="서비스 로고"
          className="mb-4 h-36 w-auto object-contain"
        />

        <h1 className="text-center text-title text-text-sub">
          <span className="text-primary">메에일</span>과 함께,
          내 속도로 시작해요
        </h1>
      
        <div className="my-5 px-5 flex w-full max-w-[280px] flex-col items-start gap-3">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5"
            >
              <img
                src={Icon}
                className="h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-caption text-text-main">
                {text}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onKakaoLogin}
          disabled={submitting}
          className="relative mt-2 flex h-[46px] w-full max-w-[280px] items-center justify-center rounded-[12px] bg-[#FEE500] px-4 text-[16px] font-medium text-[#000000] transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          <img src={kakao} className="absolute left-4 h-5 w-5" alt="" />
          <span>
            {submitting ? '로그인 중...' : '카카오로 시작하기'}
          </span>
        </button>

        {error && (
          <p
            role="alert"
            className="mt-3 text-center text-xs text-primary"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}