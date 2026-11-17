import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'lg' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary: 주요 버튼(빨강) / secondary: 취소 버튼(크림) */
  variant?: ButtonVariant;
  /** lg: 56px 하단 주요 버튼 / md: 42px 팝업 버튼 */
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-surface enabled:active:bg-primary-pressed',
  secondary: 'bg-background text-text-main enabled:active:bg-surface-warm',
};

const sizeClass: Record<ButtonSize, string> = {
  lg: 'h-14 rounded-button',
  md: 'h-[42px] rounded-card',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center px-4 text-button transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-pressed',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    />
  );
}
