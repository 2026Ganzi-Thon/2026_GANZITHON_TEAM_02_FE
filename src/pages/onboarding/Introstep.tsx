import { useEffect, useState } from 'react';

type IntroStepProps = {
  onNext: () => void;
};

export function IntroStep({ onNext }: IntroStepProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // 0.5초 뒤 서비스 로고 텍스트 표시
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // 화면 진입 2초 뒤 다음 단계로 이동
    const nextTimer = setTimeout(() => {
      onNext();
    }, 2000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(nextTimer);
    };
  }, [onNext]);

  return (
    <div className="flex min-h-0 h-full w-full flex-col items-center justify-center bg-background">
      {/* 양 이미지 */}
      <img
        src="/sheep.png"
        alt="양 캐릭터"
        className="h-auto w-14"
      />

      {/* 서비스 로고 텍스트 */}
      <p
        className={`mt-1 text-center font-logo text-text-sub transition-opacity duration-500 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
      >메에일</p>
    </div>
  );
}
