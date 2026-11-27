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

## Android ilova (APK)

`android/` — saytni Chrome orqali töliq ekranda oçadigan ilova (Trusted Web Activity, paket `uz.linguauz.app`).
Darslar va dizayn saytdan keladi, şuning uçun sayt yangilansa ilova ham yangilanadi.

```
powershell -NoProfile -ExecutionPolicy Bypass -File android\build-apk.ps1
```

Natija: `android/LinguaUZ.apk`. Yangi APK çiqarişdan oldin `android/app/build.gradle.kts` içidagi `versionCode` ni 1 ga oşiring.

**`android/linguauz.keystore` va uning parolini zaxiralang** — ular GitHub'ga çiqmaydi, ularsiz ilovani yangilab bölmaydi.
Imzo sertifikati SHA-256: `52:AF:61:C6:3D:E1:F8:7E:B8:4C:E4:E4:B0:8A:45:36:69:69:71:D9:79:EC:EB:BE:77:90:2D:A3:B6:1F:80:E9`
(manzil qatorini yaşiriş uçun `assetlinks.json` da kerak böladi).

## Yangilaş

1. HTML'da yangi Tailwind klassi işlatgan bölsangiz, CSS'ni qayta yiğing (bir marta `npm install` qilingan bölişi kerak):

   ```
   npm run build:css
   ```

   Yiğilgan CSS HTML'dagi `TAILWIND-BUILD` blokiga yoziladi, ilova bitta faylligiça qoladi.
2. `sw.js` içidagi `CACHE_VERSION` raqamini oşiring (masalan `linguauz-v7`), şunda foydalanuvçilarda eski keş yangilanadi.

Muallif: Jasur Avazov
