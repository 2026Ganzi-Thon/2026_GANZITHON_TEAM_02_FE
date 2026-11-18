import type { SupportTab } from '../../types/support';

type SupportTabsProps = {
  activeTab: SupportTab;
  onChange: (tab: SupportTab) => void;
};

export function SupportTabs({
  activeTab,
  onChange,
}: SupportTabsProps) {
  const tabs: {
    value: SupportTab;
    label: string;
  }[] = [
    { value: 'programs', label: '프로그램, 지원' },
    { value: 'organizations', label: '상담, 기관' },
  ];

  return (
    <div
      role="group"
      aria-label="지원 유형"
      className="flex gap-3"
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.value)}
            className={[
              'flex-1 rounded-[20px] border px-4 py-2 whitespace-nowrap',
              'text-center text-caption transition-colors',
              selected
                ? 'border-primary-pressed bg-primary-soft text-primary-pressed'
                : 'border-border bg-surface text-text-main',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}