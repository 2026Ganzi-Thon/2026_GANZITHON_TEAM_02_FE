import kakao from '../../assets/kakao.svg';

type LoginStepProps = {
  onKakaoLogin: () => void;
  submitting: boolean;
  error: string;
};

export function LoginStep({
  onKakaoLogin,
  submitting,
  error,
}: LoginStepProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background px-6">
      <div className="flex mx-10 w-full flex-col items-center">
        <img
          src="/sheep.png"
          alt="서비스 로고"
          className="mb-5 w-full object-contain"
        />

        <h1 className="text-center text-title text-text-sub">
          <span className="text-primary">메에일</span>과 함께,
          내 속도로 시작해요
        </h1>

        <p className="mt-3 text-center text-caption text-text-sub">
          카카오 계정으로 간편하게 시작해요.
        </p>

        <button
          type="button"
          onClick={onKakaoLogin}
          disabled={submitting}
          className="mt-6 flex h-[44px] w-full max-w-[280px] items-center justify-left px-6 gap-9 rounded-[10px] bg-[#FEE500] text-[16px] font-md text-[#000000] disabled:opacity-60"
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