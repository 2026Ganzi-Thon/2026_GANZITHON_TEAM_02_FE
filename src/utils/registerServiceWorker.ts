/**
 * PWA Service Worker 등록 함수
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[PWA] 새 콘텐츠가 준비되었습니다. 새로고침하면 반영됩니다.');
                  } else {
                    console.log('[PWA] 콘텐츠가 오프라인에서 사용할 수 있도록 캐시되었습니다.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('[PWA] Service Worker 등록 실패:', error);
        });
    });
  }
}
