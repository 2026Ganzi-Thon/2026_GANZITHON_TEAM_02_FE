
import { useState } from 'react';
import {
  ArrowUpRight,
  Pencil,
  Search,
  Heart,
  Moon,
} from 'lucide-react';

import { MobileLayout } from '../../layouts/MobileLayout';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';

type Need =
  | 'goal'
  | 'journal'
  | 'information'
  | 'counseling'
  | 'rest';

type NeedsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

const STORAGE_KEY = 'onboarding_need';

const needs = [
  {
    value: 'goal',
    title: '작은 목표 정하기',
    description: '할 수 있는 만큼만 시작해요',
    icon: ArrowUpRight,
  },
  {
    value: 'journal',
    title: '마음 적기',
    description: '정리되지 않은 말도 괜찮아요',
    icon: Pencil,
  },
  {
    value: 'information',
    title: '지원 정보 찾기',
    description: '진로, 학업, 생활에 필요한 정보',
    icon: Search,
  },
  {
    value: 'counseling',
    title: '상담, 기관 연락 안내',
    description: '도움받을 곳과 연락 방법',
    icon: Heart,
  },
  {
    value: 'rest',
    title: '쉬어가기',
    description: '오늘의 계획을 잠시 내려놓아요',
    icon: Moon,
  },
] as const;

export function NeedsStep({ onNext, onBack }: NeedsStepProps) {
  const [selectedNeed, setSelectedNeed] =
    useState<Need | null>(null);

  const handleSelect = () => {
    if (!selectedNeed) return;

    sessionStorage.setItem(STORAGE_KEY, selectedNeed);
    onNext();
  };

  const handleSkip = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    onNext();
  };

  return (
    <MobileLayout
      header={<Header showBack onBack={onBack} />}
      bottom={
        <div className="flex flex-col gap-2 px-10 pb-8 pt-4">
          <Button
            size="lg"
            disabled={!selectedNeed}
            onClick={handleSelect}
            className="w-full"
          >
            시작하기
          </Button>

          <button
            type="button"
            onClick={handleSkip}
            className="py-1 text-center text-caption text-text-sub underline underline-offset-2"
          >
            나중에 선택할게요
          </button>
        </div>
      }
    >
      <main className="flex flex-col px-10 pt-8">
        <div className="flex flex-col">
          <span className="text-label text-primary">
            YOUR CHOICE
          </span>

          <h1 className="mt-2 text-title font-semibold text-text-main">
            오늘은 무엇이 필요한가요?
          </h1>

          <p className="mt-2 text-caption text-text-sub">
            자세히 설명하지 않아도 괜찮아요.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="오늘 필요한 도움"
          className="mt-8 flex flex-col gap-4"
        >
          {needs.map((need) => {
            const isSelected =
              selectedNeed === need.value;

            const Icon = need.icon;

            return (
              <button
                key={need.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedNeed(need.value)}
                className={[
                  'flex min-h-[80px] w-full items-center',
                  'gap-4 rounded-[12px] border px-6 py-5',
                  'text-left transition-colors',
                  isSelected
                    ? 'border-primary bg-primary-soft'
                    : 'border-border bg-surface',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
                >
                  <Icon
                    size={26}
                    strokeWidth={2}
                    fill={
                      need.value === 'counseling' ||
                      need.value === 'rest'
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </span>

                <span className="flex flex-col gap-1">
                  <span className="text-button font-semibold text-text-main">
                    {need.title}
                  </span>

                  <span className="text-caption text-text-sub">
                    {need.description}
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
