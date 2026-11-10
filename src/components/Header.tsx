import type { ReactNode } from 'react';
import { BackIcon } from './icons';

type HeaderProps = {
  /** true면 Figma '공통 헤더(ver.이전)'처럼 왼쪽에 뒤로가기 버튼 표시 */
  showBack?: boolean;
  onBack?: () => void;
  /** 오른쪽 영역 (예: 로그인 링크) */
  right?: ReactNode;
};

export function Header({ showBack = false, onBack, right }: HeaderProps) {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center border-b-[0.5px] border-border">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로 가기"
          className="absolute left-7 flex size-10 items-center justify-center text-text-sub"
        >
          <BackIcon />
        </button>
      )}
      <img src="/sheep.png" alt="메에일" width={47} height={31} className="h-[31px] w-[47px] object-contain" />
      {right && <div className="absolute right-10 text-caption text-text-sub">{right}</div>}
    </header>
  );
}
