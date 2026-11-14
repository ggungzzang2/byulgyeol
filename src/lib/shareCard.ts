/**
 * 공유 카드 이미지 생성 (shareCard.ts)
 * ------------------------------------------------------------------
 * 서버 없이 브라우저 canvas 로 1080×1350(인스타그램 4:5) PNG 를 그립니다.
 * 테마마다 완전히 다른 카드가 나옵니다:
 *   mystic    — 딥 벨벳 + 금박 프레임 + 성좌 궤도
 *   character — 라벤더/피치 파스텔 + 구름 + 별 배지
 */
import type { ChartModel } from '../lib/chart';
import { palaceScore, profileOf } from '../lib/content';
import { STAR_HANJA } from '../lib/terms';
import type { ThemeId } from '../lib/theme';

const W = 1080;
const H = 1350;

const SERIF = '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const ROUND = '"Gowun Dodum", Pretendard, "Noto Sans KR", sans-serif';
const SANS = 'Pretendard, "Noto Sans KR", -apple-system, sans-serif';

async function ensureFonts() {
  const specs = [
    `500 34px ${SERIF}`,
    `700 126px ${SERIF}`,
    `500 46px ${SERIF}`,
    `500 40px ${SERIF}`,
    `500 24px ${SERIF}`,
    `400 20px ${SANS}`,
    `500 22px ${SANS}`,
    `500 26px ${SANS}`,
    `400 27px ${SANS}`,
    `400 34px ${ROUND}`,
    `400 64px ${ROUND}`,
    `400 30px ${ROUND}`,
    `400 22px ${ROUND}`,
  ];
  const sample = '별결 자미원 별의 속삭임 태양성 강점 주의 재물 연애 직업 명궁 사용설명서 1996 5 21';
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s, sample).catch(() => undefined)));
    await document.fonts.ready;
  } catch {
    /* 폰트 로드 실패 시 폴백 */
  }
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

function trackedWidth(ctx: CanvasRenderingContext2D, text: string, tracking: number) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - tracking;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: 'left' | 'right' = 'left',
) {
  let cursor = align === 'right' ? x - trackedWidth(ctx, text, tracking) : x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + tracking;
  }
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawStarPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points = 4) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? r : r * 0.34;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/* ------------------------------------------------------------------ mystic */
async function renderMystic(chart: ChartModel): Promise<string> {
  const profile = profileOf(chart.primaryStar);
  const scores: Array<[string, number]> = [
    ['재물', palaceScore(chart.palaces.find((p) => p.name === '재백궁'))],
    ['연애', palaceScore(chart.palaces.find((p) => p.name === '부처궁'))],
    ['직업', palaceScore(chart.palaces.find((p) => p.name === '관록궁'))],
  ];

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // 배경: 딥 벨벳 + 미드나잇 퍼플
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d0a1a');
  bg.addColorStop(0.45, '#151029');
  bg.addColorStop(1, '#090812');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.78, H * 0.12, 40, W * 0.78, H * 0.12, 620);
  glow.addColorStop(0, 'rgba(124, 88, 190, 0.42)');
  glow.addColorStop(1, 'rgba(124, 88, 190, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W * 0.16, H * 0.95, 40, W * 0.16, H * 0.95, 560);
  glow2.addColorStop(0, 'rgba(227, 192, 123, 0.16)');
  glow2.addColorStop(1, 'rgba(227, 192, 123, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // 별가루
  for (let i = 0; i < 180; i++) {
    const x = ((i * 137.7) % W + (i % 7) * 3) % W;
    const y = (i * 271.3) % H;
    const r = i % 11 === 0 ? 2.1 : i % 4 === 0 ? 1.4 : 1;
    ctx.fillStyle = i % 5 === 0 ? `rgba(185,155,232,${0.25 + ((i * 7) % 40) / 100})` : `rgba(255,247,230,${0.16 + ((i * 11) % 45) / 100})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 성좌 궤도
  ctx.strokeStyle = 'rgba(227,192,123,0.14)';
  ctx.lineWidth = 1.2;
  [300, 430, 560].forEach((r) => {
    ctx.beginPath();
    ctx.arc(W / 2, 700, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.fillStyle = 'rgba(227,192,123,0.85)';
  [
    [W / 2 + 300 * Math.cos(-0.6), 700 + 300 * Math.sin(-0.6)],
    [W / 2 + 560 * Math.cos(2.1), 700 + 560 * Math.sin(2.1)],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 금박 이중 프레임
  ctx.strokeStyle = 'rgba(227,192,123,0.75)';
  ctx.lineWidth = 2.4;
  ctx.strokeRect(44, 44, W - 88, H - 88);
  ctx.strokeStyle = 'rgba(227,192,123,0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  // 모서리 장식
  ctx.strokeStyle = 'rgba(227,192,123,0.8)';
  ctx.lineWidth = 2;
  const corner = (x: number, y: number, sx: number, sy: number) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * 46, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * 46);
    ctx.stroke();
  };
  corner(44, 44, 1, 1);
  corner(W - 44, 44, -1, 1);
  corner(44, H - 44, 1, -1);
  corner(W - 44, H - 44, -1, -1);

  // 헤더
  const goldGrad = ctx.createLinearGradient(0, 130, 0, 200);
  goldGrad.addColorStop(0, '#f7e7c4');
  goldGrad.addColorStop(1, '#c9a35e');

  ctx.textAlign = 'left';
  ctx.fillStyle = goldGrad;
  ctx.font = `500 38px ${SERIF}`;
  drawTracked(ctx, '자미원', 104, 158, 10);

  ctx.fillStyle = 'rgba(246,238,224,0.42)';
  ctx.font = `400 19px ${SANS}`;
  drawTracked(ctx, '紫微垣 · ZI WEI YUAN', W - 104, 154, 4, 'right');

  ctx.strokeStyle = 'rgba(227,192,123,0.3)';
  ctx.beginPath();
  ctx.moveTo(104, 196);
  ctx.lineTo(W - 104, 196);
  ctx.stroke();

  // 명궁 라벨
  ctx.fillStyle = 'rgba(227,192,123,0.9)';
  ctx.font = `500 21px ${SANS}`;
  drawTracked(ctx, '命宮 · 명궁의 주성', 104, 258, 5);

  // 주성
  ctx.fillStyle = '#f8f1e4';
  ctx.font = `700 132px ${SERIF}`;
  ctx.fillText(`${chart.primaryStar}성`, 100, 402);

  ctx.fillStyle = 'rgba(227,192,123,0.75)';
  ctx.font = `500 36px ${SERIF}`;
  ctx.textAlign = 'right';
  ctx.fillText(STAR_HANJA[chart.primaryStar] ?? '', W - 108, 396);
  ctx.textAlign = 'left';

  // 별 장식 (주성 옆)
  ctx.strokeStyle = 'rgba(227,192,123,0.55)';
  ctx.lineWidth = 1.4;
  drawStarPath(ctx, W - 210, 300, 26, 4);
  ctx.stroke();

  // 정체성
  ctx.fillStyle = '#f4ead9';
  ctx.font = `500 42px ${SERIF}`;
  const idLines = wrapText(ctx, `“${profile.identity}”`, W - 220).slice(0, 2);
  idLines.forEach((l, i) => ctx.fillText(l, 104, 490 + i * 58));

  // 키워드 칩
  let chipY = 490 + idLines.length * 58 + 16;
  let chipX = 104;
  ctx.font = `500 25px ${SANS}`;
  profile.keywords.forEach((k) => {
    const label = `#${k}`;
    const w = ctx.measureText(label).width + 48;
    if (chipX + w > W - 104) {
      chipX = 104;
      chipY += 62;
    }
    ctx.fillStyle = 'rgba(227,192,123,0.1)';
    ctx.strokeStyle = 'rgba(227,192,123,0.32)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, w, 52, 26);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(227,192,123,0.95)';
    ctx.fillText(label, chipX + 24, chipY + 35);
    chipX += w + 12;
  });

  // 구분선
  const rule = chipY + 100;
  ctx.strokeStyle = 'rgba(227,192,123,0.22)';
  ctx.beginPath();
  ctx.moveTo(104, rule);
  ctx.lineTo(W - 104, rule);
  ctx.stroke();

  // 강점 / 주의
  let cy = rule + 54;
  ctx.fillStyle = 'rgba(227,192,123,0.85)';
  ctx.font = `500 19px ${SANS}`;
  drawTracked(ctx, '강점', 104, cy, 5);
  ctx.fillStyle = 'rgba(248,241,228,0.9)';
  ctx.font = `400 26px ${SANS}`;
  const strengthLines = wrapText(ctx, profile.strength, W - 208).slice(0, 3);
  strengthLines.forEach((l, i) => ctx.fillText(l, 104, cy + 42 + i * 40));
  cy += 42 + strengthLines.length * 40 + 32;

  ctx.fillStyle = 'rgba(227,192,123,0.85)';
  ctx.font = `500 19px ${SANS}`;
  drawTracked(ctx, '주의', 104, cy, 5);
  ctx.fillStyle = 'rgba(246,238,224,0.62)';
  ctx.font = `400 26px ${SANS}`;
  const cautionLines = wrapText(ctx, profile.caution, W - 208).slice(0, 2);
  cautionLines.forEach((l, i) => ctx.fillText(l, 104, cy + 42 + i * 40));

  // 지수
  const statsY = 1128;
  ctx.strokeStyle = 'rgba(227,192,123,0.22)';
  ctx.beginPath();
  ctx.moveTo(104, statsY - 74);
  ctx.lineTo(W - 104, statsY - 74);
  ctx.stroke();

  scores.forEach(([label, value], i) => {
    const x = 104 + i * 292;
    ctx.fillStyle = goldGrad;
    ctx.font = `500 48px ${SERIF}`;
    ctx.fillText(String(value), x, statsY);
    ctx.fillStyle = 'rgba(246,238,224,0.5)';
    ctx.font = `400 19px ${SANS}`;
    drawTracked(ctx, label, x, statsY + 34, 4);
    ctx.fillStyle = 'rgba(246,238,224,0.12)';
    ctx.beginPath();
    ctx.roundRect(x, statsY + 52, 232, 4, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(227,192,123,0.9)';
    ctx.beginPath();
    ctx.roundRect(x, statsY + 52, (232 * value) / 100, 4, 2);
    ctx.fill();
  });

  // 푸터
  ctx.strokeStyle = 'rgba(227,192,123,0.22)';
  ctx.beginPath();
  ctx.moveTo(104, H - 148);
  ctx.lineTo(W - 104, H - 148);
  ctx.stroke();

  ctx.fillStyle = 'rgba(246,238,224,0.5)';
  ctx.font = `400 21px ${SANS}`;
  ctx.fillText(
    `${chart.solarText}  ·  ${chart.timeText.replace(' (정오 기준)', '')}  ·  ${chart.fiveElements}`,
    104,
    H - 102,
  );

  ctx.fillStyle = 'rgba(227,192,123,0.9)';
  ctx.font = `500 21px ${SERIF}`;
  drawTracked(ctx, '자미원 紫微垣', W - 104, H - 104, 4, 'right');

  return canvas.toDataURL('image/png');
}

/* --------------------------------------------------------------- character */
async function renderCharacter(chart: ChartModel): Promise<string> {
  const profile = profileOf(chart.primaryStar);
  const scores: Array<[string, string, number, string]> = [
    ['연애의 별', '★', palaceScore(chart.palaces.find((p) => p.name === '부처궁')), '#ff9db8'],
    ['금전의 별', '★', palaceScore(chart.palaces.find((p) => p.name === '재백궁')), '#f0c16a'],
    ['일의 별', '★', palaceScore(chart.palaces.find((p) => p.name === '관록궁')), '#8fb6ff'],
  ];

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // 파스텔 하늘
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, '#efe3ff');
  bg.addColorStop(0.42, '#f8efff');
  bg.addColorStop(0.75, '#ffeadf');
  bg.addColorStop(1, '#ffe2d3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 구름
  const cloud = (cx: number, cy: number, r: number, alpha: number) => {
    const g = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  cloud(80, 180, 220, 0.85);
  cloud(W - 40, 240, 260, 0.7);
  cloud(140, H - 140, 260, 0.8);
  cloud(W - 120, H - 90, 240, 0.6);

  // 반짝이
  for (let i = 0; i < 26; i++) {
    const x = 70 + ((i * 271) % (W - 140));
    const y = 70 + ((i * 397) % (H - 200));
    const s = i % 4 === 0 ? 11 : 6;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255,240,190,0.95)' : 'rgba(255,255,255,0.9)';
    drawStarPath(ctx, x, y, s, 4);
    ctx.fill();
  }

  // 메인 카드
  ctx.save();
  ctx.shadowColor = 'rgba(120, 86, 170, 0.28)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = 'rgba(255,255,255,0.93)';
  ctx.beginPath();
  ctx.roundRect(72, 84, W - 144, H - 214, 56);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(72, 84, W - 144, H - 214, 56);
  ctx.stroke();

  // 헤더
  ctx.fillStyle = '#7c59cf';
  ctx.font = `400 30px ${ROUND}`;
  drawTracked(ctx, '별의 속삭임', 132, 168, 2);
  ctx.fillStyle = 'rgba(146,116,192,0.6)';
  ctx.font = `400 18px ${ROUND}`;
  drawTracked(ctx, 'WHISPER OF STARS', W - 132, 166, 3, 'right');

  // 수호별 라벨
  ctx.fillStyle = '#a58ec6';
  ctx.font = `400 22px ${ROUND}`;
  ctx.fillText('너의 수호별', 132, 252);

  // 주성
  ctx.fillStyle = '#4d3a6d';
  ctx.font = `400 112px ${ROUND}`;
  ctx.fillText(`${chart.primaryStar}별`, 128, 372);

  ctx.fillStyle = '#c9b6e4';
  ctx.font = `400 25px ${ROUND}`;
  ctx.fillText(`${STAR_HANJA[chart.primaryStar] ?? ''} · 命宮`, 136, 404);

  // 가디언 (오른쪽 위 원형)
  const img = await loadImage(`${import.meta.env.BASE_URL}art/guardian-bunny.png`);
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(W - 236, 300, 86, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, W - 322, 214, 172, 172);
    ctx.restore();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(W - 236, 300, 86, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 말풍선
  const bubbleX = 132;
  const bubbleY = 436;
  const bubbleW = W - 264;
  ctx.fillStyle = '#f7f1ff';
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, 170, 34);
  ctx.fill();
  ctx.fillStyle = '#6b538f';
  ctx.font = `400 32px ${ROUND}`;
  const bubbleLines = wrapText(ctx, profile.identity, bubbleW - 76).slice(0, 2);
  const bubbleTextY = bubbleY + 85 - (bubbleLines.length - 1) * 23 + 11;
  bubbleLines.forEach((l, i) => ctx.fillText(l, bubbleX + 38, bubbleTextY + i * 46));
  // 꼬리
  ctx.fillStyle = '#f7f1ff';
  ctx.beginPath();
  ctx.moveTo(bubbleX + 54, bubbleY + 168);
  ctx.lineTo(bubbleX + 84, bubbleY + 202);
  ctx.lineTo(bubbleX + 100, bubbleY + 168);
  ctx.closePath();
  ctx.fill();

  // 키워드
  let chipX = 132;
  const chipY = 648;
  ctx.font = `400 24px ${ROUND}`;
  profile.keywords.slice(0, 4).forEach((k) => {
    const label = `✧ ${k}`;
    const w = ctx.measureText(label).width + 44;
    if (chipX + w > W - 132) return;
    ctx.fillStyle = '#efe6ff';
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, w, 50, 25);
    ctx.fill();
    ctx.fillStyle = '#7c59cf';
    ctx.fillText(label, chipX + 22, chipY + 34);
    chipX += w + 12;
  });

  // 별 배지 3개
  const badgeY = 744;
  const badgeW = (W - 264 - 24) / 3;
  scores.forEach(([label, glyph, value, color], i) => {
    const x = 132 + i * (badgeW + 12);
    const g = ctx.createLinearGradient(0, badgeY, 0, badgeY + 190);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#fbf4ff');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, badgeY, badgeW, 190, 26);
    ctx.fill();
    ctx.strokeStyle = 'rgba(146,116,192,0.16)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.font = `400 52px ${ROUND}`;
    ctx.fillText(glyph, x + badgeW / 2, badgeY + 76);
    ctx.fillStyle = '#5b4382';
    ctx.font = `400 22px ${ROUND}`;
    ctx.fillText(label, x + badgeW / 2, badgeY + 118);
    ctx.fillStyle = '#8f6fe0';
    ctx.font = `400 34px ${ROUND}`;
    ctx.fillText(String(value), x + badgeW / 2, badgeY + 164);
    ctx.textAlign = 'left';
  });

  // 강점 / 주의
  let cy = 982;
  const block = (label: string, text: string, tone: string, maxLines: number) => {
    ctx.fillStyle = tone;
    ctx.font = `400 21px ${ROUND}`;
    ctx.fillText(label, 132, cy);
    ctx.fillStyle = '#6b538f';
    ctx.font = `400 24px ${ROUND}`;
    const lines = wrapText(ctx, text, W - 264).slice(0, maxLines);
    lines.forEach((l, i) => ctx.fillText(l, 132, cy + 38 + i * 34));
    cy += 38 + lines.length * 34 + 26;
  };
  block('이런 때 빛나 ✦', profile.strength, '#d97da6', 2);
  block('이건 조심 ✧', profile.caution, '#b08bc9', 2);

  // 푸터 (카드 바깥)
  ctx.strokeStyle = 'rgba(146,116,192,0.18)';
  ctx.beginPath();
  ctx.moveTo(132, H - 110);
  ctx.lineTo(W - 132, H - 110);
  ctx.stroke();

  ctx.fillStyle = 'rgba(122,103,150,0.7)';
  ctx.font = `400 19px ${ROUND}`;
  ctx.fillText(`${chart.solarText} · ${chart.timeText.replace(' (정오 기준)', '')} · ${chart.fiveElements}`, 132, H - 62);

  ctx.fillStyle = '#8f6fe0';
  ctx.font = `400 20px ${ROUND}`;
  ctx.textAlign = 'right';
  ctx.fillText('별의 속삭임 ✦', W - 132, H - 62);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export async function renderShareCard(chart: ChartModel, theme: ThemeId = 'mystic'): Promise<string> {
  await ensureFonts();
  return theme === 'character' ? renderCharacter(chart) : renderMystic(chart);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
