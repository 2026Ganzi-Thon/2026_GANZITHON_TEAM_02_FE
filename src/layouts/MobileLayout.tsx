import type { ReactNode } from 'react';

type MobileLayoutProps = {
  /** 상단 영역 (보통 <Header />) */
  header?: ReactNode;
  /** 하단 고정 영역 (보통 <BottomNav /> 또는 <BottomActionArea />) */
  bottom?: ReactNode;
  children: ReactNode;
};

/**
 * 모바일 화면 기본 틀. global.css의 .mobile-container(최대 430px) 안에서
 * 헤더 - 스크롤되는 본문 - 하단 영역 순으로 배치한다.
 */
export function MobileLayout({ header, bottom, children }: MobileLayoutProps) {
  return (
    <div className="mobile-container flex h-dvh flex-col">
      {header}
      <main className="flex-1 overflow-y-auto">{children}</main>
      {bottom}
    </div>
  );
}
