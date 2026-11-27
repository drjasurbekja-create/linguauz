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

## Yangilaş

HTML'ni özgartirgandan keyin `sw.js` içidagi `CACHE_VERSION` raqamini oşiring (masalan `linguauz-v3`), şunda foydalanuvçilarda eski keş yangilanadi.

Muallif: Jasur Avazov
