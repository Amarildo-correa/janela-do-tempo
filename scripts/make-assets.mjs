// Gera o ícone do app, a tela de abertura e as imagens da loja a partir de
// SVG, com as cores e o wordmark do design system. Uso:
//   cd scripts && npm install && node make-assets.mjs
// A Roboto de assets/fonts precisa estar instalada no sistema
// (~/.local/share/fonts + fc-cache) para o texto sair na fonte certa.
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BG_TOP = '#2C3B4A';
const BG_MID = '#1B2835';
const BG_BASE = '#14202B';
const SKY = '#8ECDF5';
const SKY_INK = '#0E1A24';
const FONT = 'Roboto';

const gradient = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${BG_TOP}"/><stop offset="0.38" stop-color="${BG_MID}"/>
  <stop offset="0.56" stop-color="${BG_BASE}"/><stop offset="1" stop-color="${BG_BASE}"/>
</linearGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/>`;

// Largura real de um texto em Roboto 800: renderiza e apara as bordas.
async function measure(text, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 10}" height="${size * 2}">
  <text x="0" y="${size * 1.4}" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${-size * 0.011}" fill="#000">${text}</text>
</svg>`;
  const {info} = await sharp(Buffer.from(svg))
    .trim()
    .toBuffer({resolveWithObject: true});
  return info.width;
}

// Wordmark do design system: "Janela do" em azul-céu + "Tempo" numa pílula
// azul (raio 10, padding horizontal 14 e 12 de espaço, em 44 px).
async function wordmark(cx, cy, size) {
  const k = size / 44;
  const lead = await measure('Janela do', size);
  const mark = await measure('Tempo', size);
  const gap = 12 * k;
  const padX = 14 * k;
  const pillW = mark + padX * 2;
  const x0 = cx - (lead + gap + pillW) / 2;
  const base = cy + size * 0.36;
  const pillX = x0 + lead + gap;
  const text = (x, fill, value) =>
    `<text x="${x}" y="${base}" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${-size * 0.011}" fill="${fill}">${value}</text>`;
  return `${text(x0, SKY, 'Janela do')}
  <rect x="${pillX}" y="${cy - size * 0.6}" width="${pillW}" height="${size * 1.2}" rx="${10 * k}" fill="${SKY}"/>
  ${text(pillX + padX, SKY_INK, 'Tempo')}`;
}

// Imagem larga com o wordmark numa linha, a ~60% da largura (dentro da área
// segura do ícone de Fire TV, 882×448 em 1280×720).
async function wideSvg(width, height) {
  const size = Math.round(width * 0.07);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${gradient}
  ${await wordmark(width / 2, height / 2, size)}
</svg>`;
}

// Ícone quadrado: "Janela do" sobre a pílula "Tempo".
async function squareSvg(s) {
  const size = Math.round(s * 0.17);
  const k = size / 44;
  const pillW = (await measure('Tempo', size)) + 28 * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  ${gradient}
  <text x="50%" y="${s * 0.43}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${size}" fill="${SKY}">Janela do</text>
  <rect x="${(s - pillW) / 2}" y="${s * 0.5}" width="${pillW}" height="${size * 1.2}" rx="${10 * k}" fill="${SKY}"/>
  <text x="50%" y="${s * 0.5 + size * 0.96}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${size}" fill="${SKY_INK}">Tempo</text>
</svg>`;
}

// Saída sempre opaca: a loja recusa transparência em vários assets.
async function png(svg) {
  return sharp(Buffer.from(svg)).flatten({background: BG_BASE}).png().toBuffer();
}

async function render(svg, file) {
  const out = join(root, file);
  mkdirSync(dirname(out), {recursive: true});
  await sharp(await png(svg)).toFile(out);
  console.log('ok', file);
}

// Ícone do app (manifest.toml → @image/app_icon.png).
await render(await squareSvg(512), 'assets/image/app_icon.png');

// Imagens da Amazon Appstore.
await render(await squareSvg(512), 'release/assets/icon-512x512.png');
await render(await squareSvg(114), 'release/assets/icon-114x114.png');
await render(await wideSvg(1280, 720), 'release/assets/firetv-icon-1280x720.png');
await render(await wideSvg(1920, 1080), 'release/assets/firetv-background-1920x1080.png');

// Tela de abertura estática: assets/raw/SplashScreenImages.zip com
// _loop/loop00000.png e desc.txt ("<largura> <altura> <fps>" / "c 0 0 _loop").
const splash = await png(await wideSvg(1920, 1080));
const zipPath = join(root, 'assets/raw/SplashScreenImages.zip');
mkdirSync(dirname(zipPath), {recursive: true});
execFileSync(
  'python3',
  [
    '-c',
    `
import sys, zipfile
with zipfile.ZipFile(sys.argv[1], 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('_loop/loop00000.png', sys.stdin.buffer.read())
    z.writestr('desc.txt', '1920 1080 30\\nc 0 0 _loop\\n')
`,
    zipPath,
  ],
  {input: splash},
);
console.log('ok', 'assets/raw/SplashScreenImages.zip');
