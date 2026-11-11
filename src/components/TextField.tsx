import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** 입력 필드 위 제목 (예: 100일 동안 이어가고 싶은 목표) */
  label?: string;
  /** emphasis: 페이지 입력(빨간 테두리) / default: 팝업 입력(베이지 테두리) */
  tone?: 'emphasis' | 'default';
};

export function TextField({ label, tone = 'emphasis', id, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex w-full flex-col gap-4">
      {label && (
        <label htmlFor={inputId} className="text-section text-text-main">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-14 w-full rounded-card border bg-surface px-4 text-caption text-text-main',
          'placeholder:text-text-sub focus:outline-none focus:border-primary-pressed',
          'font-normal [&:not(:placeholder-shown)]:font-bold',
          tone === 'emphasis' ? 'border-primary-pressed' : 'border-border',
          className,
        )}
        {...rest}
      />
    </div>
  );
}
