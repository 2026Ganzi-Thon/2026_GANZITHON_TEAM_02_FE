import type { DailyRecord, DayStatus } from '../../types';

export const SHEEP_DAYS = 100;

export type SheepDay = {
  /** 1 ~ 100 */
  day: number;
  status: DayStatus;
  isToday: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 'YYYY-MM-DD' 두 날짜 사이의 일수 (b - a). 시간대 영향을 받지 않도록 UTC 자정으로 계산 */
function daysBetween(a: string, b: string) {
  const toUtc = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / MS_PER_DAY);
}

function addDays(key: string, days: number) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

/** 목표 시작일 기준 오늘이 몇 일째인지 (시작일 = 1일 째, 시작 전이면 1) */
export function getDayNumber(startDate: string, today: string) {
  return Math.max(1, daysBetween(startDate, today) + 1);
}

/**
 * 100칸 양털판 데이터. 칸 순서 = 목표 시작일부터의 날짜.
 * 기록이 있으면 실천/쉬어감, 없으면 기록 없음. 오늘 칸은 isToday로 표시한다.
 */
export function buildSheepDays(startDate: string, records: DailyRecord[], today: string): SheepDay[] {
  const statusByDate = new Map(records.map((record) => [record.date, record.status]));
  const todayNumber = getDayNumber(startDate, today);

  return Array.from({ length: SHEEP_DAYS }, (_, index) => {
    const day = index + 1;
    return {
      day,
      status: statusByDate.get(addDays(startDate, index)) ?? 'none',
      isToday: day === todayNumber,
    };
  });
}
