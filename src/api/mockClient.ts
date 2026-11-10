/**
 * 목업 응답 지연. 실제 네트워크처럼 로딩 상태를 확인할 수 있게 한다.
 * Supabase 연동 시 이 파일과 함께 각 api 함수 내부를 교체한다.
 */
export function mockResponse<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs);
  });
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
