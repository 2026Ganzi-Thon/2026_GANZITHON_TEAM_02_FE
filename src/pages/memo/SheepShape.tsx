import { cn } from '../../utils/cn';

export type SheepTone = 'white' | 'beige' | 'pink';

/** 몸통 색: Figma 3-1 하얀 양 / 갈색 양 / 핑크 양 (기존 토큰과 같은 색) */
const toneClass: Record<SheepTone, string> = {
  white: 'fill-surface',
  beige: 'fill-border',
  pink: 'fill-primary-soft',
};

// Figma '하얀 양'(144:1173) 265×133 프레임 기준 좌표
const WOOL_R = 6.5;
const TOP_Y = 13;
const BOTTOM_Y = 103.24;
const ROW_XS = Array.from({ length: 19 }, (_, i) => 26.01 + i * 11.787);
const SIDE_YS = Array.from({ length: 7 }, (_, i) => 22.76 + i * 11.38);

type SheepShapeProps = {
  tone: SheepTone;
  className?: string;
};

/**
 * 메모 카드 배경으로 쓰는 양 모양 (몽글몽글한 몸통 + 다리 + 얼굴).
 * Figma 벡터 에셋을 내려받을 수 없어 같은 좌표로 SVG를 다시 그렸다.
 */
export function SheepShape({ tone, className }: SheepShapeProps) {
  return (
    <svg viewBox="0 0 265 133.3" aria-hidden className={cn('block', className)}>
      {/* 다리 */}
      <g className="stroke-sheep" strokeWidth={4.5} strokeLinecap="round">
        <line x1={57.5} y1={109} x2={54} y2={121.5} />
        <line x1={197.5} y1={108} x2={204.5} y2={121.5} />
      </g>
      {/* 몸통 + 털 */}
      <g className={toneClass[tone]}>
        <rect x={13.82} y={9.75} width={237.36} height={96.73} rx={12} />
        {ROW_XS.map((x) => (
          <circle key={`t${x}`} cx={x} cy={TOP_Y} r={WOOL_R} />
        ))}
        {ROW_XS.map((x) => (
          <circle key={`b${x}`} cx={x} cy={BOTTOM_Y} r={WOOL_R} />
        ))}
        {SIDE_YS.map((y) => (
          <circle key={`l${y}`} cx={16.26} cy={y} r={WOOL_R} />
        ))}
        {SIDE_YS.map((y) => (
          <circle key={`r${y}`} cx={248.74} cy={y} r={WOOL_R} />
        ))}
      </g>
      {/* 얼굴 + 귀 */}
      <g className="fill-sheep">
        <ellipse cx={232.5} cy={99.5} rx={11.5} ry={14.5} transform="rotate(20 232.5 99.5)" />
        <ellipse cx={218} cy={91} rx={10} ry={5.2} transform="rotate(-25 218 91)" />
        <ellipse cx={240.5} cy={90.5} rx={12.5} ry={5.5} transform="rotate(20 240.5 90.5)" />
      </g>
    </svg>
  );
}
