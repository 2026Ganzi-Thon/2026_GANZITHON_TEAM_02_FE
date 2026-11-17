import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  /** md: 선택 칩1(42px) / sm: 선택 칩2(40px) */
  size?: 'md' | 'sm';
};

export function Chip({ selected = false, size = 'md', type = 'button', className, ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center rounded-chip border px-4 text-caption whitespace-nowrap transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-pressed',
        size === 'md' ? 'h-[42px]' : 'h-10',
        selected
          ? 'border-primary-pressed bg-primary-soft font-bold text-primary-pressed'
          : 'border-border bg-surface text-text-main',
        className,
      )}
      {...rest}
    />
  );
}
