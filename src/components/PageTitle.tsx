import type { ReactNode } from 'react';

type PageTitleProps = {
  /** 상단 라벨 (예: TODAY, 100-DAY PLAN | 1/2, MY NOTE) */
  label?: string;
  title: ReactNode;
  description?: ReactNode;
};

export function PageTitle({ label, title, description }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-2 px-10 py-8">
      {label && <p className="text-label text-primary">{label}</p>}
      <h1 className="text-title text-text-main">{title}</h1>
      {description && <p className="text-caption text-text-sub">{description}</p>}
    </div>
  );
}
