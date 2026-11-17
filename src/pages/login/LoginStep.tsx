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
    <div className="flex min-h-full flex-col items-center justify-center bg-background mx-10">
      <div className="flex my-11 flex-col items-center w-full">
        <img
          src="/sheep.png"
          alt="서비스 로고"
          className="mb-5 w-full object-contain"
        />

        <h1 className="text-center text-title text-text-sub w-full">
          <span className="text-primary">메에일</span>과 함께,
          내 속도로 시작해요
        </h1>
      
        <div className="flex flex-col w-full items-start px-6 py-2">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center px-6 py-2 gap-2"
            >
              <img
                src={Icon}
                className="w-6 shrink-0 text-primary"
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
          className="mt-5 flex h-[44px] w-full max-w-[280px] items-center justify-left px-6 gap-9 rounded-[12px] bg-[#FEE500] text-[16px] font-md text-[#000000] disabled:opacity-60"
        >
          <img src={kakao} className='w-6'/>
          {submitting
            ? '로그인 중...'
            : '카카오로 시작하기'}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-3 text-xs text-primary"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}