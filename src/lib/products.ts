import type { ThemeId } from './theme';

export type ProductId = 'basic' | 'premium' | 'compat';

export type Product = {
  id: ProductId;
  name: string;
  hanja: string;
  price: number;
  originalPrice?: number;
  tagline: string;
  points: string[];
  badge?: string;
  recommended?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: 'basic',
    name: '내 인생 사용설명서',
    hanja: '人生使用說明書',
    price: 4900,
    originalPrice: 6900,
    tagline: '명궁 · 배우자상 · 재물 · 진로 핵심만',
    points: ['명궁 주성 심층 해설', '연애 타입 · 배우자상', '직업 적성 3가지', '돈이 새는 구체적 장면', '올해의 주의 한 가지'],
  },
  {
    id: 'premium',
    name: '프리미엄 12궁 & 운세 풀 리포트',
    hanja: '十二宮 全解',
    price: 12900,
    originalPrice: 19900,
    tagline: '12궁 전체 + 올해·10년 흐름',
    points: [
      '12궁별 상세 풀이 (궁마다 3문단)',
      '재물·연애·직업·건강 지수',
      '대한(10년) · 유년(올해) 흐름',
      '월별 액션 가이드 12개',
      '사화·보좌성 총정리',
    ],
    badge: '가장 많이 선택',
    recommended: true,
  },
  {
    id: 'compat',
    name: '두 사람 자미두수 궁합',
    hanja: '緣分 合婚',
    price: 9900,
    tagline: '우리가 오래 가는 조건',
    points: ['두 사람 명반 비교', '감정·생활·장기 궁합 지수', '부딪히는 지점과 넘는 법', '함께할 때의 최적 역할 분담'],
  },
];

/**
 * 테마별 판매가.
 * - 자미원(미스틱): 4,900 / 12,900 / 9,900
 * - 별의 속삭임(캐릭터): 첫 상품을 3,900원(커피 한 잔 값)으로 낮춘 소액결제 라인.
 *   계산 엔진·상품 구성은 두 테마가 동일하고, 가격과 카피만 다릅니다.
 */
export const CHARACTER_FIRST_PRICE = 3900;
export const CHARACTER_COMPAT_PRICE = 6900;

export function productPrice(product: Product, theme: ThemeId): number {
  if (theme === 'character') {
    if (product.id === 'basic') return CHARACTER_FIRST_PRICE;
    if (product.id === 'compat') return CHARACTER_COMPAT_PRICE;
  }
  return product.price;
}

export function productOriginalPrice(product: Product, theme: ThemeId): number | undefined {
  if (theme === 'character' && product.id === 'compat') return 9900;
  return product.originalPrice;
}

export function productTagline(product: Product, theme: ThemeId): string {
  if (theme === 'character' && product.id === 'basic') return '명궁·연애·재물·진로·배우자상 핵심만, 커피 한 잔 값으로';
  return product.tagline;
}

export function productPoints(product: Product, theme: ThemeId): string[] {
  if (theme === 'character' && product.id === 'basic') {
    return [
      '내 수호별과 성격의 결 (명궁)',
      '끌리는 연애 타입 · 배우자상',
      '어울리는 진로 · 전공 3가지',
      '돈이 새는 장면 · 들어오는 경로',
      '올해 조심할 별방 하나',
    ];
  }
  return product.points;
}

/**
 * 상품 카드에 한 줄로 붙는 포함 범위.
 * 3,900원 핀셋 리포트와 12,900원 전체 리포트의 경계를 오해 없이 보여주기 위한 문구입니다.
 */
export function productScopeShort(product: Product, theme: ThemeId): string | null {
  const premiumPrice = productPrice(findProduct('premium'), theme).toLocaleString('ko-KR');
  if (product.id === 'basic') {
    return `핀셋 리포트 · 12궁 전체·월별 가이드 미포함 (프리미엄 ${premiumPrice}원)`;
  }
  if (product.id === 'premium') {
    return '12궁 전체 + 월별 액션 가이드 12개 포함';
  }
  return null;
}

/** 결제창에 쓰는 포함 범위 설명 (테마별 말투) */
export function productScopeNote(product: Product, theme: ThemeId): string | null {
  const premiumPrice = productPrice(findProduct('premium'), theme).toLocaleString('ko-KR');
  if (product.id === 'basic') {
    return theme === 'character'
      ? `명궁·재물·연애·진로·배우자상·돈 새는 장면까지만 핵심으로 짚은 핀셋 리포트야. 12개 별방 전체 해설과 달마다 처방은 '전체 별 이야기'(${premiumPrice}원)에 들어 있어.`
      : `명궁·재물·연애·진로·배우자상·돈 새는 장면까지만 핵심으로 짚은 핀셋 리포트입니다. 12궁 전체 해설과 월별 가이드는 프리미엄 리포트(${premiumPrice}원)에 포함됩니다.`;
  }
  if (product.id === 'premium') {
    return theme === 'character'
      ? `12개 별방 전체 해설과 달마다 처방까지 모두 담긴 리포트야. (${premiumPrice}원)`
      : `12궁 전체 해설과 월별 액션 가이드 12개까지 모두 담긴 리포트입니다. (${premiumPrice}원)`;
  }
  return null;
}

export function productBadge(product: Product, theme: ThemeId): string | undefined {
  if (theme === 'character' && product.id === 'basic') return '☕ 커피 한 잔 값';
  return product.badge;
}

export function productCta(product: Product, theme: ThemeId): string {
  if (theme === 'character') {
    if (product.id === 'basic') return '3,900원으로 내 별 읽기';
    if (product.id === 'premium') return '12개 별방 전부 보기';
    return '두 사람 별 이야기 보기';
  }
  return product.id === 'compat' ? '궁합 보기' : '명반 입력하고 시작하기';
}

export function productShortCta(product: Product, theme: ThemeId): string {
  if (theme === 'character') {
    if (product.id === 'basic') return '3,900원으로 열기';
    if (product.id === 'premium') return '전체 보기';
    return '궁합 보기';
  }
  return product.id === 'compat' ? '궁합 보기' : '열기';
}

export const findProduct = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;
