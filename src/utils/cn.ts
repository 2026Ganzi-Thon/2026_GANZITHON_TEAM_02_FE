/** 조건부 className을 공백으로 이어 붙인다. falsy 값은 무시한다. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
