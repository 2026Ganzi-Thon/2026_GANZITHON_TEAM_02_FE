import { cn } from '../../utils/cn';
import type { SheepDay } from './sheepDays';

/**
 * Figma '100일 양' (1-1 85:2196, 성공 팝업 159:3453).
 * 좌표는 Figma 벡터(276×228 기준)를 그대로 쓰고, 털 100칸만 기록에 따라 다시 그린다.
 * 칸 순서: 위 줄부터 왼쪽 → 오른쪽 (8·12·14·16·16·14·12·8 = 100칸)
 */
const ROWS = [
  { y: 46.41, x: 88.32, count: 8 },
  { y: 62.7, x: 59.93, count: 12 },
  { y: 78.99, x: 45.74, count: 14 },
  { y: 95.27, x: 31.54, count: 16 },
  { y: 111.56, x: 31.54, count: 16 },
  { y: 127.84, x: 45.74, count: 14 },
  { y: 144.13, x: 59.93, count: 12 },
  { y: 160.41, x: 88.32, count: 8 },
];
const PITCH_X = 14.194;
const RX = 5.835;
const RY = 6.026;
const DASH = 2.366; // – 표시 반 길이

const CELLS = ROWS.flatMap((row) =>
  Array.from({ length: row.count }, (_, i) => ({ cx: row.x + i * PITCH_X, cy: row.y })),
);

const FILL_BY_STATUS = {
  done: 'fill-surface', // 실천
  rest: 'fill-surface-warm', // 쉬어감
  none: 'fill-background', // 기록 없음
} as const;

type SheepBoardProps = {
  days: SheepDay[];
  className?: string;
};

export function SheepBoard({ days, className }: SheepBoardProps) {
  const doneCount = days.filter((d) => d.status === 'done').length;
  const restCount = days.filter((d) => d.status === 'rest').length;

  return (
    <svg
      viewBox="0 0 276 228"
      role="img"
      aria-label={`100칸 중 실천 ${doneCount}칸, 쉬어감 ${restCount}칸`}
      className={cn('block h-auto w-full', className)}
    >
      {/* 다리 */}
      <path
        className="fill-sheep"
        d="M79.6455 162.043L75.7026 204.386C78.8569 209.271 82.7997 209.543 87.5312 205.2L93.8397 163.672M186.102 162.043L190.045 205.2C195.828 209.543 200.034 209.271 202.662 204.386L200.297 162.043"
      />
      {/* 꼬리 */}
      <path
        className="fill-sheep"
        d="M27.5992 86.3141C14.4564 89.5712 9.19926 98.7998 11.8278 114C19.7135 109.657 26.0221 104.228 30.7535 97.7141"
      />

      {CELLS.map((cell, index) => {
        const day = days[index];
        if (!day) return null;
        return (
          <g key={day.day}>
            <ellipse
              cx={cell.cx}
              cy={cell.cy}
              rx={RX}
              ry={RY}
              className={cn(FILL_BY_STATUS[day.status], day.isToday ? 'stroke-primary-pressed' : 'stroke-border')}
              strokeWidth={day.isToday ? 1.714 : 0.797}
            />
            {day.status === 'rest' && (
              <line
                x1={cell.cx - DASH}
                x2={cell.cx + DASH}
                y1={cell.cy}
                y2={cell.cy}
                className="stroke-wool-rest"
                strokeWidth={0.956}
              />
            )}
          </g>
        );
      })}

      {/* 머리·귀·눈 (털 위에 그린다) */}
      <path
        className="fill-sheep"
        d="M242.837 74.0251C253.494 68.8935 257.21 53.83 251.136 40.3798C245.062 26.9296 231.499 20.186 220.842 25.3176C210.184 30.4492 206.469 45.5127 212.543 58.9629C218.617 72.4131 232.18 79.1567 242.837 74.0251Z"
      />
      <path
        className="fill-sheep"
        d="M223.057 43.4686C225.68 40.4607 222.558 33.1435 216.085 27.1252C209.612 21.1068 202.239 18.6662 199.616 21.6741C196.993 24.6819 200.115 31.9991 206.588 38.0175C213.061 44.0359 220.434 46.4764 223.057 43.4686Z"
      />
      <path
        className="fill-sheep"
        d="M244.537 51.7588C247.391 53.8223 253.552 49.8211 258.299 42.8218C263.045 35.8224 264.579 28.4755 261.725 26.4119C258.871 24.3483 252.71 28.3496 247.963 35.3489C243.217 42.3482 241.683 49.6952 244.537 51.7588Z"
      />
      <ellipse cx={234.993} cy={45.6} rx={2.366} ry={2.443} className="fill-background" />
    </svg>
  );
}
