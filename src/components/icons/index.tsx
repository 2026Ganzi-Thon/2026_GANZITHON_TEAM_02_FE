import type { SVGProps } from 'react';

/**
 * 하단 내비게이션 아이콘: Figma '하단 내비게이션' 컴포넌트(123:3525)에서 SVG로 내보낸 path 그대로 사용.
 * - home: arcticons:home-smart (180:11103, 40×24)
 * - memo: arcticons:youdao-note (85:499) / search: arcticons:emoji-search (85:502)
 * - user: bxs:user (85:505)
 * 선택/비선택은 색만 다르므로(#B83B30 / #75665E) stroke·fill은 currentColor로 두고
 * 부모의 text-* 클래스로 색을 지정한다.
 */
type IconProps = SVGProps<SVGSVGElement>;

const outline = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 0.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function HomeIcon(props: IconProps) {
  return (
    <svg width={40} height={24} viewBox="0 0 40 24" fill="none" aria-hidden {...props}>
      <path {...outline} d="M29.75 10.446L20 3L10.25 10.446V20.446H29.75V10.446Z" />
    </svg>
  );
}

export function MemoIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        {...outline}
        d="M11.4101 21.1205L21.1711 11.1785L12.7361 2.8635L2.85361 12.685L2.82861 21.1365L11.4101 21.1205Z"
      />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        {...outline}
        d="M14.765 14.765L21.25 21.25M9.80351 2.75C13.6895 2.75 16.826 5.902 16.826 9.8035C16.8273 10.7261 16.6465 11.6398 16.294 12.4924C15.9415 13.3449 15.4243 14.1196 14.772 14.7719C14.1196 15.4243 13.345 15.9415 12.4924 16.294C11.6398 16.6465 10.7261 16.8272 9.80351 16.826C5.90201 16.826 2.75001 13.69 2.75001 9.8035C2.74889 8.87691 2.93057 7.95919 3.28464 7.10292C3.63872 6.24664 4.15823 5.46863 4.81343 4.81343C5.46863 4.15823 6.24665 3.63871 7.10292 3.28464C7.9592 2.93056 8.87691 2.74888 9.80351 2.75Z"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7.5 7.5C7.5 9.981 9.519 12 12 12C14.481 12 16.5 9.981 16.5 7.5C16.5 5.019 14.481 3 12 3C9.519 3 7.5 5.019 7.5 7.5ZM20 22H21V21C21 17.141 17.859 14 14 14H10C6.14 14 3 17.141 3 21V22H20Z"
      />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="none" stroke="currentColor" strokeWidth={2} d="M17 2L7 12l10 10" />
    </svg>
  );
}
