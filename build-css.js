// Tailwind CSS'ni yiğib, HTML içiga joylaydi — ilova bitta fayl bölib qoladi
// va CDN'siz (internetsiz, file:// orqali ham) töğri körinadi.
//
// Işlatiş:  npm run build:css
// HTML'da yangi Tailwind klassi işlatganingizdan keyin har safar qayta işga tuşiring.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HTML = path.join(__dirname, 'ingliz_tili_4_ko_nikma_akademiyasi.html');
const START = '<!-- TAILWIND-BUILD-START -->';
const END = '<!-- TAILWIND-BUILD-END -->';

const css = execFileSync(process.execPath, [
    require.resolve('tailwindcss/lib/cli.js'),
    '-c', path.join(__dirname, 'tailwind.config.js'),
    '-i', path.join(__dirname, 'tailwind.input.css'),
    '--minify'
], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

const html = fs.readFileSync(HTML, 'utf8');
const s = html.indexOf(START), e = html.indexOf(END);
if (s < 0 || e < s) throw new Error(`HTML'da ${START} ... ${END} bloki topilmadi`);

const block = `${START}\n    <style id="tailwind-build">${css}</style>\n    `;
const out = html.slice(0, s) + block + html.slice(e);
if (out !== html) fs.writeFileSync(HTML, out);
console.log(`Tailwind CSS: ${(css.length / 1024).toFixed(1)} KB${out === html ? ' (özgariş yöq)' : ' — HTML yangilandi'}`);
