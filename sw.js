// 캐시 버전을 올릴 때마다(v1 -> v2 ...) 예전 캐시는 자동으로 지워지고
// HTML/JSON 같은 핵심 파일은 항상 네트워크를 먼저 시도합니다.
const CACHE = 'sh-mobility-v2';
const ASSETS = ['./index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // 문서(HTML) 요청은 네트워크 우선: 최신 배포본을 항상 먼저 시도하고,
  // 오프라인일 때만 캐시로 대체합니다.
  const isNavigation = e.request.mode === 'navigate' ||
    (e.request.destination === 'document');

  if (isNavigation) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // 그 외 정적 자산(아이콘 등)은 캐시 우선 + 백그라운드 갱신
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
