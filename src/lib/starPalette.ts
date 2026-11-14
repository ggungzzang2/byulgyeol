/**
 * 14주성별 고유 팔레트 · 상징 문양 (starPalette.ts)
 * ------------------------------------------------------------------
 * 같은 자미두수 주성이라도 카드의 공기(색·빛·문양)가 달라야 '내 별' 카드로
 * 소장하고 싶어집니다. 이 파일이 그 기준을 한 곳에서 정합니다.
 *
 *  - STAR_VISUAL : 주성별 배경 그라데이션 / 오라 / 강조색 / 문양 / 무드 문구
 *  - EMBLEM      : 100×100 좌표계의 SVG path 모음 (웹 SVG·canvas 공용)
 *                   canvas 에서는 Path2D(d) 로 그대로 그립니다.
 */
import type { ChartModel } from './chart';

export type EmblemPrim = { d: string; mode: 'stroke' | 'fill' };

export type StarVisual = {
  hanja: string;
  mood: string;
  /** 카드 배경 그라데이션 (위 → 중간 → 아래) */
  bg: [string, string, string];
  /** 주 오라 (캐릭터 뒤 은은한 빛) */
  aura: string;
  /** 보조 오라 (아래쪽 색 번짐) */
  aura2: string;
  /** 배경 위 밝은 글자색 */
  light: string;
  /** 숫자·장식 강조색 */
  accent: string;
  /** 카드 프레임 (금박 or 라벤더) */
  frame: string;
  emblem: EmblemPrim[];
};

/* ---------------------------------------------------------- 문양 생성기 */
function radialPath(count: number, inner: number, outer: number, offsetDeg = 0, tip = 0): string {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = ((i * 360) / count + offsetDeg) * (Math.PI / 180);
    const x1 = 50 + Math.cos(a) * inner;
    const y1 = 50 + Math.sin(a) * inner;
    const x2 = 50 + Math.cos(a) * outer;
    const y2 = 50 + Math.sin(a) * outer;
    if (tip > 0) {
      const half = (Math.PI / count) * 0.42;
      const bx = 50 + Math.cos(a + half) * inner;
      const by = 50 + Math.sin(a + half) * inner;
      const cx = 50 + Math.cos(a - half) * inner;
      const cy = 50 + Math.sin(a - half) * inner;
      parts.push(`M${cx.toFixed(2)} ${cy.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} L${bx.toFixed(2)} ${by.toFixed(2)} Z`);
    } else {
      parts.push(`M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`);
    }
  }
  return parts.join(' ');
}

function rosettePath(petals: number, ringR: number, petalW: number, petalH: number): string {
  const parts: string[] = [];
  for (let i = 0; i < petals; i++) {
    const a = ((i * 360) / petals) * (Math.PI / 180);
    const cx = 50 + Math.cos(a) * ringR;
    const cy = 50 + Math.sin(a) * ringR;
    const deg = (a * 180) / Math.PI + 90;
    const rot = (x: number, y: number) => {
      const rad = (deg * Math.PI) / 180;
      const dx = x - cx;
      const dy = y - cy;
      return [(cx + dx * Math.cos(rad) - dy * Math.sin(rad)).toFixed(2), (cy + dx * Math.sin(rad) + dy * Math.cos(rad)).toFixed(2)];
    };
    const pts: Array<[number, number]> = [
      [cx, cy - petalH],
      [cx + petalW, cy],
      [cx, cy + petalH],
      [cx - petalW, cy],
    ];
    parts.push(`M${pts.map(([x, y]) => rot(x, y).join(' ')).join(' L')} Z`);
  }
  return parts.join(' ');
}

const EMBLEM = {
  crown: [
    { d: 'M14 44 L30 58 L50 26 L70 58 L86 44 L86 78 L14 78 Z', mode: 'stroke' as const },
    { d: 'M11 87 H89', mode: 'stroke' as const },
    { d: 'M46.6 43.4 a3.4 3.4 0 1 0 6.8 0 a3.4 3.4 0 1 0 -6.8 0 Z', mode: 'fill' as const },
    { d: 'M27.4 54.6 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 Z', mode: 'fill' as const },
    { d: 'M67.4 54.6 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 Z', mode: 'fill' as const },
  ],
  compass: [
    { d: 'M18 50 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0 Z', mode: 'stroke' as const },
    { d: 'M50 26 L57.5 50 L50 74 L42.5 50 Z', mode: 'fill' as const },
    { d: 'M50 4 V12 M50 88 V96 M4 50 H12 M88 50 H96', mode: 'stroke' as const },
  ],
  sun: [
    { d: 'M31 50 a19 19 0 1 0 38 0 a19 19 0 1 0 -38 0 Z', mode: 'fill' as const },
    { d: radialPath(12, 27, 38, 0, 1), mode: 'stroke' as const },
    { d: 'M50 2 V8 M50 92 V98 M2 50 H8 M92 50 H98', mode: 'stroke' as const },
  ],
  coin: [
    { d: 'M18 50 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0 Z', mode: 'stroke' as const },
    { d: 'M30 50 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 Z', mode: 'stroke' as const },
    { d: 'M42.5 42.5 H57.5 V57.5 H42.5 Z', mode: 'fill' as const },
  ],
  lotus: [
    { d: 'M50 16 C63 31 63 57 50 74 C37 57 37 31 50 16 Z', mode: 'stroke' as const },
    { d: 'M23 32 C42 40 48 59 44 78 C27 71 18 50 23 32 Z', mode: 'stroke' as const },
    { d: 'M77 32 C58 40 52 59 56 78 C73 71 82 50 77 32 Z', mode: 'stroke' as const },
    { d: 'M20 87 Q50 96 80 87', mode: 'stroke' as const },
  ],
  flame: [
    {
      d: 'M50 9 C60 28 58 38 66 48 C74 58 70 81 50 91 C30 81 26 58 34 48 C42 38 40 28 50 9 Z',
      mode: 'stroke' as const,
    },
    { d: 'M50 43 C56 52 56 61 51.5 67 C46 73 41 68 41.5 60 C42 53 46 49 50 43 Z', mode: 'fill' as const },
  ],
  gate: [
    { d: 'M22 92 V52 A28 28 0 0 1 78 52 V92', mode: 'stroke' as const },
    { d: 'M36 92 V61 A14 14 0 0 1 64 61 V92', mode: 'stroke' as const },
    { d: 'M10 92 H90', mode: 'stroke' as const },
  ],
  treasury: [
    { d: 'M20 44 H80 V88 H20 Z', mode: 'stroke' as const },
    { d: 'M11 44 L50 18 L89 44', mode: 'stroke' as const },
    { d: 'M43 65 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 Z', mode: 'fill' as const },
    { d: 'M50 65 V78', mode: 'stroke' as const },
  ],
  scale: [
    { d: 'M50 16 V86', mode: 'stroke' as const },
    { d: 'M20 32 H80', mode: 'stroke' as const },
    { d: 'M20 32 L12 56 H28 Z', mode: 'stroke' as const },
    { d: 'M80 32 L72 56 H88 Z', mode: 'stroke' as const },
    { d: 'M32 88 H68', mode: 'stroke' as const },
  ],
  mountain: [
    { d: 'M8 84 L38 36 L62 84', mode: 'stroke' as const },
    { d: 'M46 84 L64 52 L86 84', mode: 'stroke' as const },
    { d: 'M6 90 H94', mode: 'stroke' as const },
  ],
  sword: [
    { d: 'M50 6 L58 32 V62 H42 V32 Z', mode: 'fill' as const },
    { d: 'M28 63 H72', mode: 'stroke' as const },
    { d: 'M50 63 V84', mode: 'stroke' as const },
    { d: 'M45 86 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z', mode: 'fill' as const },
  ],
  crescent: [
    { d: 'M74 21 A37 37 0 1 0 74 79 A27 27 0 0 1 74 21 Z', mode: 'stroke' as const },
    { d: 'M27.6 64.4 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0 Z', mode: 'fill' as const },
    { d: 'M20.2 41.8 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0 Z', mode: 'fill' as const },
  ],
  rosette: [
    { d: rosettePath(6, 26, 9, 20), mode: 'stroke' as const },
    { d: 'M44 50 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z', mode: 'fill' as const },
  ],
  burst: [
    { d: radialPath(12, 16, 46, 0, 0), mode: 'stroke' as const },
    { d: radialPath(12, 30, 36, 15, 0), mode: 'stroke' as const },
    { d: 'M42 50 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z', mode: 'fill' as const },
  ],
};

/* ------------------------------------------------------- 14주성 팔레트 */
export const STAR_VISUAL: Record<string, StarVisual> = {
  자미: {
    hanja: '紫微',
    mood: '로열 퍼플 · 왕관의 밤',
    bg: ['#2a1142', '#3d1c5e', '#150a24'],
    aura: 'rgba(224,178,255,0.55)',
    aura2: 'rgba(255,214,160,0.22)',
    light: '#FFF2FF',
    accent: '#F6D9A8',
    frame: 'rgba(246,216,168,0.82)',
    emblem: EMBLEM.crown,
  },
  천기: {
    hanja: '天機',
    mood: '청록 새벽 · 나침반',
    bg: ['#0d2439', '#123a54', '#070f1b'],
    aura: 'rgba(120,214,255,0.45)',
    aura2: 'rgba(180,255,235,0.18)',
    light: '#EAF8FF',
    accent: '#C9ECFF',
    frame: 'rgba(200,235,255,0.7)',
    emblem: EMBLEM.compass,
  },
  태양: {
    hanja: '太陽',
    mood: '노을 골드 · 태양 광채',
    bg: ['#3a1520', '#7d3a2c', '#1b0a10'],
    aura: 'rgba(255,178,110,0.6)',
    aura2: 'rgba(255,120,120,0.25)',
    light: '#FFF3DE',
    accent: '#FFD49A',
    frame: 'rgba(255,214,160,0.85)',
    emblem: EMBLEM.sun,
  },
  무곡: {
    hanja: '武曲',
    mood: '황동 주화 · 단단한 빛',
    bg: ['#241a10', '#4a371e', '#100b06'],
    aura: 'rgba(244,204,126,0.48)',
    aura2: 'rgba(255,236,180,0.2)',
    light: '#FFF6E2',
    accent: '#F7DFA4',
    frame: 'rgba(247,223,164,0.8)',
    emblem: EMBLEM.coin,
  },
  천동: {
    hanja: '天同',
    mood: '물빛 연꽃 · 안식',
    bg: ['#102c39', '#1d4d5d', '#07131b'],
    aura: 'rgba(150,232,220,0.45)',
    aura2: 'rgba(255,225,190,0.18)',
    light: '#EDFFFA',
    accent: '#CFF6EA',
    frame: 'rgba(207,246,234,0.72)',
    emblem: EMBLEM.lotus,
  },
  염정: {
    hanja: '廉貞',
    mood: '장미빛 불꽃 · 열기',
    bg: ['#33111f', '#5e1f2e', '#16070e'],
    aura: 'rgba(255,124,152,0.5)',
    aura2: 'rgba(255,190,140,0.2)',
    light: '#FFEFF2',
    accent: '#FFC6C0',
    frame: 'rgba(255,198,192,0.75)',
    emblem: EMBLEM.flame,
  },
  천부: {
    hanja: '天府',
    mood: '남청 보물고 · 금빛',
    bg: ['#141f3b', '#233258', '#080d19'],
    aura: 'rgba(150,182,255,0.42)',
    aura2: 'rgba(255,216,150,0.2)',
    light: '#EEF3FF',
    accent: '#F3DCA6',
    frame: 'rgba(243,220,166,0.8)',
    emblem: EMBLEM.treasury,
  },
  태음: {
    hanja: '太陰',
    mood: '달빛 블루실버 · 초승달',
    bg: ['#0f1b32', '#1e3352', '#060b14'],
    aura: 'rgba(190,216,255,0.5)',
    aura2: 'rgba(220,200,255,0.18)',
    light: '#F2F7FF',
    accent: '#DCEAFF',
    frame: 'rgba(220,234,255,0.75)',
    emblem: EMBLEM.crescent,
  },
  탐랑: {
    hanja: '貪狼',
    mood: '자두빛 정원 · 욕망의 꽃',
    bg: ['#2a1030', '#4c1a4b', '#12060f'],
    aura: 'rgba(255,148,218,0.48)',
    aura2: 'rgba(255,190,150,0.2)',
    light: '#FFF0FA',
    accent: '#FFD1EC',
    frame: 'rgba(255,209,236,0.75)',
    emblem: EMBLEM.rosette,
  },
  거문: {
    hanja: '巨門',
    mood: '흑연 회랑 · 목소리',
    bg: ['#191922', '#2c2c3b', '#09090e'],
    aura: 'rgba(206,206,232,0.36)',
    aura2: 'rgba(190,170,255,0.16)',
    light: '#F5F4FB',
    accent: '#E6E2F5',
    frame: 'rgba(230,226,245,0.7)',
    emblem: EMBLEM.gate,
  },
  천상: {
    hanja: '天相',
    mood: '은빛 저울 · 균형',
    bg: ['#1e2029', '#343846', '#0c0d12'],
    aura: 'rgba(255,226,180,0.34)',
    aura2: 'rgba(200,220,255,0.18)',
    light: '#FBF8F0',
    accent: '#F2E3C2',
    frame: 'rgba(242,227,194,0.75)',
    emblem: EMBLEM.scale,
  },
  천량: {
    hanja: '天梁',
    mood: '이끼 숲 · 늙은 나무',
    bg: ['#1b2417', '#2f3d26', '#0a0f08'],
    aura: 'rgba(198,226,156,0.4)',
    aura2: 'rgba(255,232,180,0.18)',
    light: '#F7FBE9',
    accent: '#EDE6C6',
    frame: 'rgba(237,230,198,0.72)',
    emblem: EMBLEM.mountain,
  },
  칠살: {
    hanja: '七殺',
    mood: '검붉은 칼날 · 밤',
    bg: ['#2a0c13', '#4c141d', '#110509'],
    aura: 'rgba(255,102,112,0.46)',
    aura2: 'rgba(255,170,120,0.2)',
    light: '#FFF0EE',
    accent: '#FFD6C8',
    frame: 'rgba(255,214,200,0.75)',
    emblem: EMBLEM.sword,
  },
  파군: {
    hanja: '破軍',
    mood: '폭풍 전야 · 별의 파동',
    bg: ['#121739', '#2a2a5f', '#070916'],
    aura: 'rgba(142,152,255,0.5)',
    aura2: 'rgba(190,150,255,0.2)',
    light: '#EEF0FF',
    accent: '#DBDFFF',
    frame: 'rgba(219,223,255,0.75)',
    emblem: EMBLEM.burst,
  },
};

const FALLBACK = STAR_VISUAL['자미'];

export function starVisual(star: string): StarVisual {
  return STAR_VISUAL[star] ?? FALLBACK;
}

export function starMood(star: string): string {
  return starVisual(star).mood;
}

/** 웹 패널용 — 주성 색으로 은은하게 물들인 배경 */
export function starGlowStyle(star: string): { background: string } {
  const v = starVisual(star);
  return {
    background: `radial-gradient(closest-side, ${v.aura}, transparent 72%)`,
  };
}

/* ------------------------------------------------------------ canvas 렌더 */
export type EmblemDraw = {
  cx: number;
  cy: number;
  size: number;
  color: string;
  fillAlpha?: number;
  strokeAlpha?: number;
  lineWidth?: number;
  rotation?: number;
};

/** 주성 문양을 canvas 에 그립니다. (웹 SVG 와 같은 path 사용) */
export function drawStarEmblem(ctx: CanvasRenderingContext2D, star: string, opt: EmblemDraw) {
  const v = starVisual(star);
  const size = opt.size;
  const scale = size / 100;
  ctx.save();
  // 문양 좌표계(0~100)의 중심이 (cx, cy) 에 오도록 반만큼 당겨 놓는다
  ctx.translate(opt.cx - size / 2, opt.cy - size / 2);
  if (opt.rotation) ctx.rotate(opt.rotation);
  ctx.scale(scale, scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = (opt.lineWidth ?? 2.2) / scale;
  v.emblem.forEach((prim) => {
    const path = new Path2D(prim.d);
    if (prim.mode === 'fill') {
      ctx.globalAlpha = opt.fillAlpha ?? 0.9;
      ctx.fillStyle = opt.color;
      ctx.fill(path);
    } else {
      ctx.globalAlpha = opt.strokeAlpha ?? 0.9;
      ctx.strokeStyle = opt.color;
      ctx.stroke(path);
    }
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

/** 명반의 주성 — 카드·헤더가 참조하는 단일 진입점 */
export function chartStarVisual(chart: ChartModel): StarVisual {
  return starVisual(chart.primaryStar);
}
