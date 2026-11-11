const pad = (value: number) => String(value).padStart(2, '0');

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
