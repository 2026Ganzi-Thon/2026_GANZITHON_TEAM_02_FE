import type { SVGProps } from 'react';

/**
 * Figma 하단 내비게이션·헤더에서 사용한 Iconify 아이콘과 같은 path.
 * 색은 currentColor를 따르므로 부모의 text-* 클래스로 지정한다.
 * - home: arcticons:home-smart
 * - memo: arcticons:youdao-note / search: arcticons:emoji-search
 * - user: bxs:user / back: grommet-icons:previous
 * viewBox는 Figma 에셋처럼 아이콘 실제 영역에 맞춰 잘라 두었다.
 */
type IconProps = SVGProps<SVGSVGElement>;

const outline = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1,
  vectorEffect: 'non-scaling-stroke',
} as const;

export function HomeIcon(props: IconProps) {
  // Figma 프레임 크기(40×23.4) 그대로, 아이콘은 비율 유지
  return (
    <svg width={40} height={23.446} viewBox="3.5 5.554 41 36.892" aria-hidden {...props}>
      <path {...outline} d="M43.5 21.446L24 6.554L4.5 21.446v20h39z" />
    </svg>
  );
}


export function MemoIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="4.5 4.5 39 39" aria-hidden {...props}>
      <path {...outline} d="m22.82 42.241l19.522-19.884l-16.87-16.63L5.707 25.37l-.05 16.903Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 48 48" aria-hidden {...props}>
      <path
        {...outline}
        d="M19.607 5.5c7.772 0 14.045 6.304 14.045 14.107a14.026 14.026 0 0 1-14.045 14.045C11.804 33.652 5.5 27.38 5.5 19.607A14.09 14.09 0 0 1 19.607 5.5m9.923 24.03L42.5 42.5"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="2.5 2 19 19" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"
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
