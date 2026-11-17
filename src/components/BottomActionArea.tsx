import type { ReactNode } from 'react';

type BottomActionAreaProps = {
  /** 버튼 위 안내 문구 (예: 내용은 언제든 다시 바꿀 수 있어요) */
  helperText?: ReactNode;
  children: ReactNode;
};

/** Figma '하단 액션 영역' — 화면 아래 주요 버튼 영역 */
export function BottomActionArea({ helperText, children }: BottomActionAreaProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-10 py-8">
      {helperText && <p className="text-caption text-text-sub">{helperText}</p>}
      {children}
    </div>
  );
}
