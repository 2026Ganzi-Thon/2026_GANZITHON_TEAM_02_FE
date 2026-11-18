type LoadingTextProps = {
  text?: string;
  className?: string;
  /** 기존 코드와의 호환성을 위해 유지 (wave로 고정 동작) */
  variant?: string;
};

export function LoadingText({
  text = '불러오는 중...',
  className = '',
}: LoadingTextProps) {
  return (
    <div
      role="status"
      aria-label={text}
      className={`inline-flex items-center justify-center text-caption text-text-sub ${className}`}
    >
      <span aria-hidden="true" className="inline-flex">
        {Array.from(text).map((char, index) => (
          <span
            key={index}
            className="inline-block animate-loading-wave motion-reduce:animate-none"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </div>
  );
}
