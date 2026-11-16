import { interests } from './constants';

type ProfileStepProps = {
  nickname: string;
  region: string;
  selectedInterests: string[];
  submitting: boolean;
  error: string;
  onNicknameChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onClearError: () => void;
  onInterestToggle: (interest: string) => void;
  onProfileSubmit: () => void;
  onSkip: () => void;
};

export function ProfileStep({
  nickname,
  region,
  selectedInterests,
  submitting,
  error,
  onNicknameChange,
  onRegionChange,
  onClearError,
  onInterestToggle,
  onProfileSubmit,
  onSkip,
}: ProfileStepProps) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="flex h-[54px] shrink-0 items-center justify-center border-b border-border">
        <img
          src="/sheep.png"
          alt="서비스 로고"
          className="h-8 w-auto object-contain"
        />
      </header>

      <main className="flex-1 px-8 py-8">
        <p className="text-label text-primary">
          NICE TO MEET YOU
        </p>

        <h1 className="text-title text-text-main pt-2">
          어떻게 불러드릴까요?
        </h1>

        <p className="text-caption text-text-sub pt-2">
          선택 정보는 나중에 내 정보에서 바꿀 수 있어요.
        </p>

        {/* 닉네임 */}
        <section className="mt-8">
          <label
            htmlFor="nickname"
            className="text-section text-text-main"
          >
            닉네임 <span className="text-primary">*</span>
          </label>

          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => {
              onNicknameChange(e.target.value);
              onClearError();
            }}
            placeholder="예) 구름"
            maxLength={20}
            className="mt-2 h-14 w-full rounded-[12px] border border-primary bg-surface px-4 text-caption text-text-main outline-none placeholder:text-text-sub focus:ring-1 focus:ring-primary"
          />
        </section>

        {/* 지역 */}
        <section className="mt-8 border-t border-border pt-8">
          <label
            htmlFor="region"
            className="text-section text-text-main"
          >
            지역 (선택)
          </label>

          <p className="mt-2 text-caption leading-5 text-text-sub">
            지금 생활하는 시·군·구까지 적어주세요. 상세 주소는 필요하지 않아요.
          </p>

          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            placeholder="경기도 부천시 소사구"
            className="mt-2 h-14 w-full rounded-[12px] border border-primary bg-surface px-4 text-caption text-text-main outline-none placeholder:text-text-sub focus:ring-1 focus:ring-primary"
          />
        </section>

        {/* 관심 분야 */}
        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-section text-text-main">
            관심 분야 (선택)
          </h2>

          <p className="mt-2 text-caption text-text-sub">
            여러 개 골라도 좋아요. 언제든 바꿀 수 있어요.
          </p>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {interests.map((interest) => {
              const isSelected =
                selectedInterests.includes(interest);

              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() =>
                    onInterestToggle(interest)
                  }
                  aria-pressed={isSelected}
                  className={`min-h-12 rounded-[20px] border px-2 py-2 text-caption transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary-soft font-semibold text-primary'
                      : 'border-border bg-surface text-text-main'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="mt-5 text-center text-xs text-primary"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onProfileSubmit}
          disabled={submitting}
          className="mt-6 h-14 w-full rounded-[10px] bg-primary text-section text-white disabled:opacity-60"
        >
          {submitting
            ? '저장 중...'
            : '설정하고 시작하기'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={submitting}
          className="mt-2 w-full text-center text-caption text-text-sub underline underline-offset-2 disabled:opacity-60"
        >
          나중에 선택할게요
        </button>
      </main>
    </div>
  );
}