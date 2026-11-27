// LinguaUZ service worker — ilova internetsiz ham oçiladi.
//
// Qanday işlaydi:
//  • Örnatilganda ilovaning özi (HTML, manifest, ikonkalar) va barça taşqi kutubxonalar
//    (Tailwind, şriftlar, Font Awesome ikonkalari, Tone.js) keşga oldindan yuklab qöyiladi.
//  • Sahifa (HTML): avval internetdan olinadi — yangilanişlar darhol keladi; internet bölmasa keşdan.
//  • Kutubxonalar va şriftlar: keşdan beriladi (tez), orqa fonda yangilab qöyiladi.
//
// Ilova yangilanganda CACHE_VERSION ni oşiring — eski keş öçiriladi.
const CACHE_VERSION = 'linguauz-v5';
const APP_CACHE = `${CACHE_VERSION}-app`;
const LIB_CACHE = `${CACHE_VERSION}-lib`;

const APP_SHELL = [
    './',
    './ingliz_tili_4_ko_nikma_akademiyasi.html',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png'
];

const FA = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1';
const LIBRARIES = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js',
    `${FA}/css/all.min.css`,
    // all.min.css içidagi ikonka şriftlari faqat kerak bölganda yuklanadi — oldindan olib qöyamiz
    `${FA}/webfonts/fa-solid-900.woff2`,
    `${FA}/webfonts/fa-regular-400.woff2`,
    `${FA}/webfonts/fa-brands-400.woff2`
];

// Google Fonts CSS fayllari; ular içidagi şrift fayllari (fonts.gstatic.com) ham yuklab olinadi
const FONT_CSS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&display=swap'
];
// Özbek va ingliz matni uçun lotin yozuvi kifoya (ş ç ö ğ — latin-ext içida)
const FONT_SUBSETS = ['latin', 'latin-ext'];

async function cacheUrl(cache, url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    await cache.put(url, res.clone());
    return res;
}

async function cacheGoogleFonts(cache) {
    for (const cssUrl of FONT_CSS) {
        const css = await (await cacheUrl(cache, cssUrl)).text();
        // CSS "/* latin */ @font-face { ... url(...) ... }" bloklaridan iborat
        const blocks = css.split('/*').slice(1);
        const fontUrls = blocks
            .filter(b => FONT_SUBSETS.includes(b.slice(0, b.indexOf('*/')).trim()))
            .map(b => (b.match(/url\((https:[^)]+)\)/) || [])[1])
            .filter(Boolean);
        await Promise.all([...new Set(fontUrls)].map(u => cacheUrl(cache, u)));
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const app = await caches.open(APP_CACHE);
        // cache: 'reload' — brauzerning HTTP keşini (GitHub Pages: 10 daqiqa) çetlab, serverdan yangisini olamiz
        await app.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' })));
        const lib = await caches.open(LIB_CACHE);
        // Bitta kutubxona yuklanmasa ham ilovaning özi örnatilaversin — qolganlari keyin keşga tuşadi
        await Promise.allSettled([...LIBRARIES.map(u => cacheUrl(lib, u)), cacheGoogleFonts(lib)]);
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

// Sahifa: internet → keş. 4 soniyada javob kelmasa (sekin internet), keşdagisi körsatiladi.
async function networkFirst(request) {
    const cache = await caches.open(APP_CACHE);
    try {
        const res = await Promise.race([
            // cache: 'no-cache' — har safar serverdan tekşiradi (özgarmagan bölsa 304, juda tez), yangilaniş darhol keladi
            fetch(request, { cache: 'no-cache' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
        ]);
        // Har bir sahifa öz manzili bilan saqlanadi (index.html — yönaltiruvçi, asosiy fayl — ilova)
        if (res.ok) cache.put(request.url.split('#')[0].split('?')[0], res.clone());
        return res;
    } catch (e) {
        return (await cache.match(request, { ignoreSearch: true }))
            || (await cache.match('./ingliz_tili_4_ko_nikma_akademiyasi.html'))
            || Response.error();
    }
}

// Kutubxona va şriftlar: keşdan darhol, orqa fonda yangilaş
async function staleWhileRevalidate(request, event) {
    const cache = await caches.open(LIB_CACHE);
    const cached = await cache.match(request.url);
    const update = fetch(request.url, { mode: 'cors', credentials: 'omit' })
        .catch(() => fetch(request)) // CORS ruxsat bermasa — brauzerning asl so'rovi
        .then(res => { if (res.ok || res.type === 'opaque') cache.put(request.url, res.clone()); return res; })
        .catch(() => null);
    if (cached) { event.waitUntil(update); return cached; }
    return (await update) || Response.error();
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }
    if (url.origin === self.location.origin) {
        // Preview serverning jonli yangilaş so'rovi keşlanmaydi
        if (url.pathname.startsWith('/__')) return;
        event.respondWith(caches.match(request, { ignoreSearch: true }).then(c => c || fetch(request)));
        return;
    }
    if (/^(cdn\.tailwindcss\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
        event.respondWith(staleWhileRevalidate(request, event));
    }
});
