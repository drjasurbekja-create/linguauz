# LinguaUZ — Ingliz tilini örganiş platformasi

Öqiş, tinglaş, yoziş va gapiriş maşqlari bilan ingliz tilini örganiş uçun veb-ilova. Uç daraja (A1–C1), kunlik maqsad va seriya, sözlarni takrorlaş (Leitner usuli), xato javoblarga tuşuntiriş.

- Telefonga ilova sifatida örnatiş mumkin (PWA) va bir marta oçilgaç **internetsiz ham işlaydi**.
- Progress foydalanuvçining öz brauzerida saqlanadi.

## Fayllar

| Fayl | Vazifasi |
|------|----------|
| `ingliz_tili_4_ko_nikma_akademiyasi.html` | Ilovaning özi: dizayn, darslar va barça mantiq |
| `index.html` | Sayt manzilini ilovaga yönaltiradi |
| `sw.js` | Service worker — internetsiz işlaş |
| `manifest.webmanifest`, `icons/` | Telefonga örnatiş uçun nom, rang va ikonkalar |
| `tailwind.config.js`, `tailwind.input.css`, `build-css.js` | Tailwind CSS'ni yiğib, HTML içiga joylaydi |

## Yangilaş

1. HTML'da yangi Tailwind klassi işlatgan bölsangiz, CSS'ni qayta yiğing (bir marta `npm install` qilingan bölişi kerak):

   ```
   npm run build:css
   ```

   Yiğilgan CSS HTML'dagi `TAILWIND-BUILD` blokiga yoziladi, ilova bitta faylligiça qoladi.
2. `sw.js` içidagi `CACHE_VERSION` raqamini oşiring (masalan `linguauz-v7`), şunda foydalanuvçilarda eski keş yangilanadi.

Muallif: Jasur Avazov
