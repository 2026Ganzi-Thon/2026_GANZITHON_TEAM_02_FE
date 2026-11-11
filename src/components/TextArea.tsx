import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** 메모 입력 팝업 필드 (기본 높이 141px) */
export function TextArea({ className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        'h-[141px] w-full resize-none rounded-card border border-border bg-surface px-4 py-2',
        'text-caption text-text-main placeholder:text-text-sub',
        'focus:outline-none focus:border-primary-pressed',
        className,
      )}
      {...rest}
    />
  );
}
