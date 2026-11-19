import { useState } from 'react';
import { MobileLayout } from '../../layouts/MobileLayout';
import { Button } from '../../components/Button';

import Sun from '../../assets/setup/sun.svg'
import Cloud from '../../assets/setup/cloud.svg'

type Condition = 'good' | 'bad';

type ConditionStepProps = {
  onNext: (condition: Condition | 'skipped') => void;
};

const conditions = [
  {
    value: 'good',
    title: '괜찮아요',
    description: '오늘의 목표 만나기',
    iconSrc: Sun,
  },
  {
    value: 'bad',
    title: '힘들어요',
    description: '나에게 필요한 도움 찾기',
    iconSrc: Cloud,
  },
] as const;

export function ConditionStep({ onNext }: ConditionStepProps) {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  const handleSelect = () => {
    if (!selectedCondition) return;
    onNext(selectedCondition);
  };

  const handleSkip = () => {
    onNext('skipped');
  };

  return (
    <MobileLayout
      header={
        <header className="flex h-14 items-center justify-center border-b border-border">
          <img
            src="/sheep.png"
            alt="서비스 로고"
            className="h-[31px] w-[47px] object-contain"
          />
        </header>
      }
      bottom={
        <div className="flex flex-col gap-2 px-10 pb-8 pt-4">
          <Button
            size="lg"
            disabled={!selectedCondition}
            onClick={handleSelect}
            className="w-full"
          >
            선택하기
          </Button>

          <button
            type="button"
            onClick={handleSkip}
            className="py-1 text-center text-caption text-text-sub underline underline-offset-2"
          >
            오늘은 건너뛸게요
          </button>
        </div>
      }
    >
      <main className="flex flex-col px-10 pt-8">
        <div className="flex flex-col">
          <span className="text-label text-primary">
            TODAY
          </span>

          <h1 className="mt-2 text-title font-semibold">
            오늘은 어떤가요?
          </h1>

          <p className="mt-2 text-caption text-text-sub">
            지금 느끼는 상태를 골라주세요.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="오늘의 컨디션"
          className="mt-8 flex flex-col gap-4"
        >
          {conditions.map((condition) => {
            const isSelected =
              selectedCondition === condition.value;

            return (
              <button
                key={condition.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  setSelectedCondition(condition.value)
                }
                className={[
                  'flex min-h-[80px] w-full items-center',
                  'gap-4 rounded-[12px] border px-6 py-5',
                  'text-left transition-colors bg-surface',
                  isSelected
                    ? 'border-primary'
                    : 'border-border',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
                >
                  <img
                    src={condition.iconSrc}
                    alt=''
                    className="h-[26px] w-[26px] object-contain"
                  />
                </span>

                <span className="flex flex-col gap-1">
                  <span className="text-button font-semibold text-text-main">
                    {condition.title}
                  </span>

                  <span className="text-caption text-text-sub">
                    {condition.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </MobileLayout>
  );
}
