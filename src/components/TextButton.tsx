import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Figma의 밑줄 링크형 버튼 (예: 목표 수정하기, 계획 수정하기, 오늘은 쉬어갈게요) */
export function TextButton({ type = 'button', className, ...rest }: TextButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'self-start text-caption font-bold text-primary-pressed underline',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-pressed',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...rest}
    />
  );
}
