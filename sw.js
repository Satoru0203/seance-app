// Service Worker de la web app Séance (iPhone, iPad) : l'enveloppe de l'app (pages, scripts,
// styles, icônes) est gardée sur l'appareil → ouverture instantanée, même sans réseau (4G
// faible, ordinateurs éteints). Jamais les vidéos, ni les réponses du fournisseur ou de VidzyBot
// (autres adresses : jamais interceptées).
// Mise à jour : la nouvelle version s'installe en arrière-plan et sert au lancement suivant
// (pas en pleine séance : les morceaux de l'ancienne version restent disponibles jusque-là).
// La version et la liste des fichiers sont remplies à la construction (vite.config.ts, mode
// « pwa ») : leurs marqueurs n'apparaissent qu'une fois, dans le code ci-dessous.

const VERSION = 't2p1oi';
const FILES = ["./","./index.html","./manifest.webmanifest","./catalogue.json","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./assets/index-CSB7CX2I.js","./assets/hls-CydbS6hn.js","./assets/mpegts-CSzauDET.js","./assets/index-BFhIBzwB.css","./assets/manrope-cyrillic-400-normal-BMzJvInZ.woff2","./assets/manrope-cyrillic-400-normal-Dvx59UGC.woff","./assets/manrope-cyrillic-600-normal-DvRl3Mj-.woff2","./assets/manrope-cyrillic-600-normal-It4mZcQk.woff","./assets/manrope-cyrillic-700-normal-7JNVKxyl.woff","./assets/manrope-cyrillic-700-normal-Dw_fZAg2.woff2","./assets/manrope-cyrillic-800-normal-AvdZ5mAV.woff2","./assets/manrope-cyrillic-800-normal-BuEMjQU-.woff","./assets/manrope-greek-400-normal-CM4qok81.woff2","./assets/manrope-greek-400-normal-DuX9RsAR.woff","./assets/manrope-greek-600-normal-BoRV6lzK.woff2","./assets/manrope-greek-600-normal-CF2i9ZRY.woff","./assets/manrope-greek-700-normal-CHUG9PD8.woff2","./assets/manrope-greek-700-normal-DyfsrCpP.woff","./assets/manrope-greek-800-normal-Bw-67qu9.woff","./assets/manrope-greek-800-normal-CDvU698_.woff2","./assets/manrope-latin-400-normal-8tf8FM3T.woff","./assets/manrope-latin-400-normal-PaqtzbVb.woff2","./assets/manrope-latin-600-normal-4f0koTD-.woff2","./assets/manrope-latin-600-normal-BqgrALkZ.woff","./assets/manrope-latin-700-normal-BZp_XxE4.woff2","./assets/manrope-latin-700-normal-DGRFkw-m.woff","./assets/manrope-latin-800-normal-BfWYOv1c.woff2","./assets/manrope-latin-800-normal-uHUdIJgA.woff","./assets/manrope-latin-ext-400-normal-C-X6QNXX.woff","./assets/manrope-latin-ext-400-normal-CMDvPJRp.woff2","./assets/manrope-latin-ext-600-normal-_gBojHdJ.woff2","./assets/manrope-latin-ext-600-normal-u5Pl7hTU.woff","./assets/manrope-latin-ext-700-normal-DYOwVNan.woff2","./assets/manrope-latin-ext-700-normal-eVCcYqtJ.woff","./assets/manrope-latin-ext-800-normal-BQAQsuQc.woff","./assets/manrope-latin-ext-800-normal-DdFx7KEb.woff2","./assets/manrope-vietnamese-400-normal-D7E_mLGF.woff","./assets/manrope-vietnamese-400-normal-DHb3EETF.woff2","./assets/manrope-vietnamese-600-normal-C1J5PCl_.woff2","./assets/manrope-vietnamese-600-normal-lA7a_7Ok.woff","./assets/manrope-vietnamese-700-normal-CUqMx5-1.woff2","./assets/manrope-vietnamese-700-normal-pt65Fn2Z.woff","./assets/manrope-vietnamese-800-normal-ClPWri-A.woff2","./assets/manrope-vietnamese-800-normal-bvg7iBCV.woff","./assets/syne-greek-700-normal-C01yjWE_.woff","./assets/syne-greek-700-normal-RbvlO3f8.woff2","./assets/syne-greek-800-normal-DtzFnRR0.woff","./assets/syne-greek-800-normal-n2LZS_yH.woff2","./assets/syne-latin-700-normal-AF3Rs61n.woff2","./assets/syne-latin-700-normal-Cd-_iCn5.woff","./assets/syne-latin-800-normal-BuJcbPcX.woff","./assets/syne-latin-800-normal-EehdNYzx.woff2","./assets/syne-latin-ext-700-normal-C-qCH-vM.woff","./assets/syne-latin-ext-700-normal-DuyXglMe.woff2","./assets/syne-latin-ext-800-normal-B2iBRfEf.woff","./assets/syne-latin-ext-800-normal-CAQAsWuS.woff2"];
const CACHE = `seance-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('seance-') && k !== CACHE).map((k) => caches.delete(k)))),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Pages : l'app gardée (même hors réseau) ; le réseau sert à vérifier les mises à jour.
  if (request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html', { ignoreSearch: true }).then((cached) => cached || fetch(request)));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
