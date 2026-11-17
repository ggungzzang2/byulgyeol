/**
 * 2027 정미년 신년 부적 카드 (amuletCard.ts)
 * ------------------------------------------------------------------
 * 브라우저 canvas 로 1080×1620 PNG 를 그립니다. (스토리·세로 저장용)
 *
 * - 다크 + 금박 프레임 + 별가루: '별의 속삭임' 감성 유지
 * - 주성 고유 팔레트(14주성)의 빛을 오라로 얹어 카드마다 공기가 달라집니다
 * - 띠 그림·캐릭터 클립아트는 쓰지 않습니다 (촌스러운 띠별 부적 톤 금지)
 */
import type { ChartModel } from './chart';
import type { NewYear2027Content } from './newyear2027';
import { drawStarEmblem, starVisual } from './starPalette';
import type { ThemeId } from './theme';

const W = 1080;
const H = 1620;

const SERIF = '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const SANS = 'Pretendard, "Noto Sans KR", -apple-system, sans-serif';
const ROUND = '"Gowun Dodum", Pretendard, "Noto Sans KR", sans-serif';

async function ensureFonts() {
  const specs = [
    `500 30px ${SERIF}`,
    `700 150px ${SERIF}`,
    `500 40px ${SERIF}`,
    `400 30px ${SANS}`,
    `500 26px ${SANS}`,
    `500 28px ${SANS}`,
    `400 34px ${ROUND}`,
    `400 30px ${ROUND}`,
    `400 26px ${ROUND}`,
  ];
  const sample = '별의 속삭임 정미년 붉은 양 신년 부적 수호 원석 회복 지혜 2027';
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s, sample).catch(() => undefined)));
    await document.fonts.ready;
  } catch {
    /* 폰트를 못 받으면 시스템 폰트로 그립니다 */
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: 'left' | 'right' | 'center' = 'left',
) {
  let total = 0;
  for (const ch of text) total += ctx.measureText(ch).width + tracking;
  total -= tracking;
  let cursor = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + tracking;
  }
}

export async function renderAmulet2027(
  chart: ChartModel,
  content: NewYear2027Content,
  theme: ThemeId = 'character',
): Promise<string> {
  await ensureFonts();

  const v = starVisual(chart.primaryStar);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  /* 1. 밤하늘 배경 */
  const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
  bg.addColorStop(0, '#0c0a18');
  bg.addColorStop(0.45, '#141029');
  bg.addColorStop(1, '#08070f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 주성 고유 빛 — 배경을 은은하게 덧입히고, 위쪽에만 살짝 밝기를 더합니다
  const wash = ctx.createLinearGradient(0, 0, W, H * 0.75);
  wash.addColorStop(0, hexToRgba(v.bg[1], 0.36));
  wash.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  const top = ctx.createLinearGradient(0, 60, 0, 900);
  top.addColorStop(0, hexToRgba(v.accent, 0.14));
  top.addColorStop(0.55, hexToRgba(v.accent, 0.04));
  top.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, H);

  const gold = ctx.createRadialGradient(W * 0.82, H * 0.86, 30, W * 0.82, H * 0.86, 620);
  gold.addColorStop(0, 'rgba(227,192,123,0.22)');
  gold.addColorStop(1, 'rgba(227,192,123,0)');
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, W, H);

  const purple = ctx.createRadialGradient(W * 0.14, H * 0.16, 20, W * 0.14, H * 0.16, 520);
  purple.addColorStop(0, hexToRgba(v.accent, 0.16));
  purple.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = purple;
  ctx.fillRect(0, 0, W, H);

  /* 2. 별가루 */
  for (let i = 0; i < 240; i++) {
    const x = (i * 181.7 + (i % 7) * 13) % W;
    const y = (i * 263.9 + (i % 5) * 19) % H;
    const r = i % 17 === 0 ? 2.6 : i % 6 === 0 ? 1.6 : 1;
    ctx.fillStyle =
      i % 5 === 0
        ? hexToRgba(v.accent, 0.2 + ((i * 7) % 38) / 100)
        : `rgba(255,250,238,${0.12 + ((i * 11) % 40) / 100})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* 3. 주성 문양 워터마크 */
  drawStarEmblem(ctx, chart.primaryStar, {
    cx: W / 2,
    cy: 470,
    size: 620,
    color: v.accent,
    fillAlpha: 0.05,
    strokeAlpha: 0.18,
    lineWidth: 1.6,
  });

  /* 4. 금박 이중 프레임 */
  const frameGrad = ctx.createLinearGradient(0, 0, W, H);
  frameGrad.addColorStop(0, '#f4e3bd');
  frameGrad.addColorStop(0.45, '#c9a35e');
  frameGrad.addColorStop(1, '#f0ddb4');

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 26;
  ctx.strokeStyle = frameGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(40, 40, W - 80, H - 80, 30);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = 'rgba(227,192,123,0.34)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(58, 58, W - 116, H - 116, 22);
  ctx.stroke();

  // 모서리 장식
  ctx.strokeStyle = frameGrad;
  ctx.lineWidth = 2.4;
  const corner = (x: number, y: number, sx: number, sy: number) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * 64, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * 64);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + sx * 18, y + sy * 11);
    ctx.lineTo(x + sx * 11, y + sy * 18);
    ctx.stroke();
  };
  corner(40, 40, 1, 1);
  corner(W - 40, 40, -1, 1);
  corner(40, H - 40, 1, -1);
  corner(W - 40, H - 40, -1, -1);

  /* 5. 헤더 */
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(246,238,224,0.9)';
  ctx.font = `400 34px ${ROUND}`;
  drawTracked(ctx, theme === 'character' ? '별의 속삭임' : '자미원', 104, 118, 2);

  ctx.fillStyle = 'rgba(246,238,224,0.58)';
  ctx.font = `400 24px ${SANS}`;
  drawTracked(ctx, '동양 전통 자미두수 · 12궁 명반', W - 104, 117, 1.4, 'right');

  ctx.strokeStyle = 'rgba(227,192,123,0.28)';
  ctx.beginPath();
  ctx.moveTo(104, 152);
  ctx.lineTo(W - 104, 152);
  ctx.stroke();

  /* 6. 2027 · 丁未 */
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(227,192,123,0.92)';
  ctx.font = `400 28px ${SANS}`;
  drawTracked(ctx, '2027  NEW YEAR AMULET', W / 2, 230, 5, 'center');

  const goldText = ctx.createLinearGradient(0, 268, 0, 560);
  goldText.addColorStop(0, '#fbf0d6');
  goldText.addColorStop(0.5, '#e3c07b');
  goldText.addColorStop(1, '#c19a56');

  // 세로로 쌓은 두 글자 (丁 / 未)
  ctx.fillStyle = goldText;
  ctx.font = `700 150px ${SERIF}`;
  const chars = content.hanja.split('');
  chars.forEach((ch, i) => ctx.fillText(ch, W / 2, 404 + i * 156));

  // 글자 양옆 장식선
  ctx.strokeStyle = 'rgba(227,192,123,0.4)';
  ctx.lineWidth = 1.2;
  [340, 496].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, y);
    ctx.lineTo(W / 2 - 120, y);
    ctx.moveTo(W / 2 + 120, y);
    ctx.lineTo(W / 2 + 200, y);
    ctx.stroke();
  });

  /* 7. 해의 이름 */
  ctx.fillStyle = 'rgba(246,238,224,0.95)';
  ctx.font = `500 38px ${SERIF}`;
  drawTracked(ctx, `${content.stemBranch}년 · ${content.animal}의 해`, W / 2, 662, 3, 'center');

  ctx.fillStyle = 'rgba(246,238,224,0.6)';
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText(
    `${chart.name ? `${chart.name} 님의` : '나의'} 신년 부적  ·  ${chart.primaryStar}${theme === 'character' ? '별' : '성'}`,
    W / 2,
    712,
  );

  /* 8. 키워드 칩 */
  ctx.font = `400 28px ${ROUND}`;
  const labels = content.keywords.map((k) => `✧ ${k}`);
  const sizes = labels.map((l) => ctx.measureText(l).width + 52);
  const gap = 14;
  const totalW = sizes.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
  let chipX = (W - totalW) / 2;
  const chipY = 756;
  ctx.textAlign = 'left';
  labels.forEach((label, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.strokeStyle = 'rgba(227,192,123,0.42)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, sizes[i], 54, 27);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(246,238,224,0.94)';
    ctx.fillText(label, chipX + 26, chipY + 37);
    chipX += sizes[i] + gap;
  });

  /* 9. 한 줄 조언 */
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(248,241,228,0.94)';
  ctx.font = `500 40px ${SERIF}`;
  const adviceLines = wrapText(ctx, content.advice, W - 260).slice(0, 3);
  adviceLines.forEach((l, i) => ctx.fillText(l, W / 2, 900 + i * 58));

  /* 10. 보완 기운 · 수호 원석 */
  const blockY = 1120;
  ctx.strokeStyle = 'rgba(227,192,123,0.24)';
  ctx.beginPath();
  ctx.moveTo(150, blockY - 74);
  ctx.lineTo(W - 150, blockY - 74);
  ctx.stroke();

  ctx.fillStyle = 'rgba(227,192,123,0.85)';
  ctx.font = `400 25px ${SANS}`;
  drawTracked(ctx, '보완의 기운 · 수호 원석', W / 2, blockY - 20, 4, 'center');

  const stoneY = blockY + 84;
  const stoneX = W / 2 - 150;
  const glow = ctx.createRadialGradient(stoneX, stoneY, 6, stoneX, stoneY, 62);
  glow.addColorStop(0, hexToRgba(content.stone.colorHex, 0.85));
  glow.addColorStop(1, hexToRgba(content.stone.colorHex, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(stoneX, stoneY, 62, 0, Math.PI * 2);
  ctx.fill();

  const stoneGrad = ctx.createRadialGradient(stoneX - 10, stoneY - 12, 4, stoneX, stoneY, 38);
  stoneGrad.addColorStop(0, '#ffffff');
  stoneGrad.addColorStop(0.45, content.stone.colorHex);
  stoneGrad.addColorStop(1, 'rgba(10,8,18,0.9)');
  ctx.fillStyle = stoneGrad;
  ctx.beginPath();
  ctx.arc(stoneX, stoneY, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(248,241,228,0.96)';
  ctx.font = `500 32px ${SERIF}`;
  ctx.fillText(content.stone.name, W / 2 - 74, stoneY - 6);
  ctx.fillStyle = 'rgba(246,238,224,0.62)';
  ctx.font = `400 25px ${SANS}`;
  ctx.fillText(content.needLabel, W / 2 - 74, stoneY + 34);

  /* 11. 봉인 (vermilion seal) */
  const sealX = W - 196;
  const sealY = H - 300;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.06);
  ctx.fillStyle = 'rgba(150,52,48,0.9)';
  ctx.beginPath();
  ctx.roundRect(-52, -52, 104, 104, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(240,200,190,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-44, -44, 88, 88, 8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,236,228,0.94)';
  ctx.font = `700 56px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('守', 0, 20);
  ctx.restore();

  /* 12. 푸터 */
  ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(227,192,123,0.22)';
  ctx.beginPath();
  ctx.moveTo(104, H - 176);
  ctx.lineTo(W - 104, H - 176);
  ctx.stroke();

  ctx.fillStyle = 'rgba(246,238,224,0.66)';
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText('2027. 1. 1 — 12. 31  ·  소장용 부적', 104, H - 122);

  ctx.fillStyle = 'rgba(227,192,123,0.9)';
  ctx.font = `400 28px ${ROUND}`;
  ctx.textAlign = 'right';
  ctx.fillText('별의 속삭임 ✦', W - 104, H - 122);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(246,238,224,0.34)';
  ctx.font = `400 21px ${SANS}`;
  ctx.fillText(
    '효능을 보장하지 않는 소장용 콘텐츠입니다 · 의료·투자 판단의 근거가 아닙니다',
    W / 2,
    H - 78,
  );

  return canvas.toDataURL('image/png');
}

/** 카드 이미지를 저장합니다. */
export function downloadAmulet(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
