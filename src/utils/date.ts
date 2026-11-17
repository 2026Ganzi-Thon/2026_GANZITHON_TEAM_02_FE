const pad = (value: number) => String(value).padStart(2, '0');

/** 기기 시간 기준 오늘 날짜: 2026-11-11 (DailyRecord.date, ConditionLog.date 형식) */
export function todayKey(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** 메모 카드용: 11.09 | 18:30 */
export function formatMonthDayTime(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} | ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 메모 상세 팝업용: 2026.11.10 | 02:30 */
export function formatFullDateTime(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${formatMonthDayTime(iso)}`;
}
