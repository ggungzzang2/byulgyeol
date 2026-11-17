import type { BirthInput } from '../lib/chart';
import {
  CHARACTER_FIRST_PRICE,
  PRODUCTS,
  WESTERN_PRODUCTS,
  ZIWEI_PRODUCTS,
  productBadge,
  productCta,
  productOriginalPrice,
  productPoints,
  productPrice,
  productScopeShort,
  productTagline,
  type ProductId,
} from '../lib/products';
import type { SystemId } from '../lib/systems';
import { THEME_ART, useTheme } from '../lib/theme';
import BirthForm from './BirthForm';
import SystemTabs from './SystemTabs';
import WesternLanding from './WesternLanding';
import NewYearBanner from './NewYearBanner';
import { SectionLabel, StarMark } from './ui';

type Props = {
  onSubmit: (input: BirthInput) => void;
  onSample: () => void;
  onProduct: (id: ProductId) => void;
  /** 랜딩의 2027 신년 부적 배너 */
  onNewYear: () => void;
  system: SystemId;
  onSystemChange: (system: SystemId) => void;
};

const SPARKLES: Array<{ top: string; left: string; size: number; delay: string; opacity: number }> = [
  { top: '8%', left: '6%', size: 12, delay: '0s', opacity: 0.9 },
  { top: '18%', left: '92%', size: 9, delay: '1.2s', opacity: 0.8 },
  { top: '46%', left: '3%', size: 7, delay: '2.4s', opacity: 0.7 },
  { top: '62%', left: '96%', size: 11, delay: '0.6s', opacity: 0.85 },
  { top: '30%', left: '78%', size: 6, delay: '3.1s', opacity: 0.6 },
];

function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle"
          style={{ top: s.top, left: s.left, fontSize: s.size, color: '#fff6d8', animationDelay: s.delay, opacity: s.opacity, textShadow: '0 0 12px rgba(255,214,160,0.9)' }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

function CharacterHeader({ system }: { system: SystemId }) {
  const { copy } = useTheme();
  const western = system === 'western';
  return (
    <header
      className="sticky top-0 z-30 no-print"
      style={{
        borderBottom: '1px solid rgba(146,116,192,0.12)',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div className="mx-auto flex h-[64px] max-w-5xl items-center justify-between gap-3 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="guardian-avatar h-8 w-8">
            <img src={THEME_ART.character.hero} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="t-display text-[16.5px] text-[#58417c]">{copy.brand.name}</span>
          <span className="text-[11px] text-[#c9b6e4]" aria-hidden="true">
            ✦
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-[12px] text-[#6a5788] sm:flex">
          {western ? (
            <>
              <a href="#western-chart">내 천궁도</a>
              <a href="#western-reports">서양 리포트</a>
            </>
          ) : (
            <>
              <a href="#chart">내 별</a>
              <a href="#collection">별 컬렉션</a>
              <a href="#reports">별 이야기</a>
            </>
          )}
        </nav>
        <a href={western ? '#western-chart' : '#chart'} className="t-btn t-btn-primary px-4 py-2.5 text-[11.5px]">
          {western ? '내 천궁도 보기' : copy.headerCta}
        </a>
      </div>
    </header>
  );
}

function LuckRing({ score }: { score: number }) {
  return (
    <div
      className="h-[104px] w-[104px] shrink-0 rounded-full p-[7px]"
      style={{ background: `conic-gradient(#9470e4 ${score * 3.6}deg, rgba(146,116,192,0.14) 0deg)` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
        <span className="text-[9px] text-[#75628f]">행운지수</span>
        <span className="num text-[26px] font-bold leading-none text-[#5b4382]">{score}%</span>
      </div>
    </div>
  );
}

export default function CharacterLanding({ onSubmit, onSample, onProduct, onNewYear, system, onSystemChange }: Props) {
  const { copy } = useTheme();

  return (
    <div id="top">
      <CharacterHeader system={system} />
      <SystemTabs system={system} onChange={onSystemChange} />

      {system === 'western' ? (
        <WesternLanding onSubmit={onSubmit} onSample={onSample} onProduct={onProduct} />
      ) : (
        <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <SparkleField />
        <div
          className="pointer-events-none absolute -right-24 top-10 h-[380px] w-[380px] rounded-full opacity-80 blur-[2px]"
          style={{ background: 'radial-gradient(closest-side,#ffe3cd, transparent 70%)' }}
        />
        <div className="pointer-events-none absolute -left-24 top-40 h-[300px] w-[300px] rounded-full" style={{ background: 'radial-gradient(closest-side,#e7d8ff, transparent 72%)' }} />

        <div className="relative mx-auto max-w-5xl px-5 pt-9 sm:px-8 sm:pt-12">
          <div className="grid items-center gap-4 sm:grid-cols-[1.02fr_0.98fr] sm:gap-8 lg:gap-12">
            <div className="animate-rise">
              <span className="t-chip !py-1.5 !text-[10.5px]" style={{ color: '#7c59cf' }}>
                <span aria-hidden="true">✦</span> 오늘도 별이 반짝이는 중
              </span>
              <h1 className="t-display mt-4 text-[27px] leading-[1.45] text-[#4d3a6d] sm:text-[40px] lg:text-[44px]">
                오늘 너의 별이
                <br />
                살짝 신호를 보내고 있어
                <span className="ml-1 align-middle text-[17px]" style={{ color: '#f0b968' }} aria-hidden="true">
                  ✦
                </span>
              </h1>
              <p className="mt-3 max-w-[330px] text-[13px] leading-[1.9] text-[#7c6a99] sm:text-[14px]">
                별빛 가디언이 읽어주는
                <br />
                나만의 사용설명서
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a href="#chart" className="t-btn t-btn-primary px-5 py-3 text-[12px]">
                  내 별지도 열기
                  <span aria-hidden="true">→</span>
                </a>
                <button onClick={onSample} className="t-btn t-btn-ghost px-4 py-3 text-[11.5px]">
                  예시 먼저 보기
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[10.5px] text-[#9a86b6]">
                <span>✧ 12개 별방</span>
                <span>✧ 14주성</span>
                <span>✧ 커피 한 잔 값 3,900원부터</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[340px] animate-rise [animation-delay:100ms] sm:max-w-[400px]">
              <div className="absolute inset-x-6 bottom-2 h-24 rounded-full opacity-70 blur-2xl" style={{ background: 'radial-gradient(closest-side,#ffd9b8, transparent)' }} />
              <img
                src={THEME_ART.character.hero}
                alt={THEME_ART.character.alt}
                className="animate-floaty relative mx-auto w-[88%] rounded-[36px] object-cover"
                style={{ boxShadow: '0 40px 60px -40px rgba(120,84,170,0.65)' }}
              />
              <div className="bubble relative -mt-5 w-[86%] px-4 py-3 text-[11.5px] leading-[1.7]">
                오늘의 행운은
                <br />
                <b className="font-semibold text-[#6b4fa0]">네 선택을 빛나게</b> 해 줄 거야.
              </div>
            </div>
          </div>

          {/* 오늘의 운세 미리보기 */}
          <div className="t-card relative mt-6 p-5 animate-rise [animation-delay:180ms] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.18em] text-[#75628f]">TODAY · 오늘의 별빛</p>
                <h2 className="t-display mt-1.5 truncate text-[17px] text-[#4d3a6d]">
                  <span aria-hidden="true">🌟</span> 작은 선택이 큰 변화를 가져와
                </h2>
                <p className="mt-2 text-[11.5px] leading-[1.8] text-[#6a5788]">
                  새로운 시도를 두려워하지 마.
                  <br />
                  네 직감이 좋은 길로 이끌어 줄 거야.
                </p>
              </div>
              <LuckRing score={78} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5 border-t pt-3" style={{ borderColor: 'rgba(146,116,192,0.12)' }}>
              {[
                { glyph: '✦', color: '#e58aa6', label: '연애의 별', value: 80 },
                { glyph: '✦', color: '#d9a441', label: '금전의 별', value: 70 },
                { glyph: '✦', color: '#7b8fd6', label: '일의 별', value: 75 },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-[13px]" style={{ color: s.color }} aria-hidden="true">
                    {s.glyph}
                  </span>
                  <p className="mt-0.5 text-[9.5px] text-[#907da9]">{s.label}</p>
                  <p className="num text-[12px] font-semibold text-[#6b4fa0]">{s.value}%</p>
                </div>
              ))}
            </div>

            <p className="mt-3 rounded-xl px-3 py-2 text-[10.5px] leading-relaxed text-[#6a5788]" style={{ background: 'rgba(237,227,255,0.6)' }}>
              ✧ 위 숫자는 예시야. 생년월일을 알려주면 <b className="text-[#6b4fa0]">너의 별로 다시 계산</b>해 줄게!
            </p>
          </div>
        </div>
      </section>

      {/* 별 컬렉션 */}
      <section id="collection" className="mx-auto mt-12 max-w-5xl scroll-mt-20 px-5 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <SectionLabel index="✧">STAR COLLECTION</SectionLabel>
            <h2 className="t-display mt-3 text-[21px] text-[#4d3a6d]">나의 별 컬렉션</h2>
          </div>
          <span className="hidden text-[11px] text-[#75628f] sm:block">별지도를 열면 하나씩 모을 수 있어</span>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
          {[
            { name: '설렘의 별', gain: '연애의 별 +10%', glyph: '★', color: '#ffb3c7', bg: 'linear-gradient(180deg,#fff0f5,#ffe3ec)', tag: 'NEW' },
            { name: '용기의 별', gain: '일의 별 +10%', glyph: '★', color: '#8fb6ff', bg: 'linear-gradient(180deg,#eff5ff,#e3edff)' },
            { name: '직관의 별', gain: '세 별 고르게 +3%', glyph: '★', color: '#b395f5', bg: 'linear-gradient(180deg,#f6efff,#ece2ff)', tag: '3' },
            { name: '풍요의 별', gain: '금전의 별 +10%', glyph: '★', color: '#f0c16a', bg: 'linear-gradient(180deg,#fff9ec,#fff2d9)', tag: '2' },
            { name: '평온의 별', gain: '일의 별 +5%', glyph: '★', color: '#7fd4b8', bg: 'linear-gradient(180deg,#effcf7,#e2f7ef)', tag: '1' },
          ].map((b) => (
            <div key={b.name} className="star-badge relative" style={{ background: b.bg }}>
              {b.tag && (
                <span
                  className="absolute right-1.5 top-1.5 rounded-full px-1.5 text-[8px] font-semibold text-white"
                  style={{ background: b.tag === 'NEW' ? '#ff94b4' : 'rgba(146,116,192,0.55)' }}
                >
                  {b.tag}
                </span>
              )}
              <span className="star-badge__glyph" style={{ color: b.color }} aria-hidden="true">
                {b.glyph}
              </span>
              <span className="star-badge__name !text-[9.5px] sm:!text-[10.5px]">{b.name}</span>
              <span className="star-badge__gain hidden sm:block">{b.gain}</span>
            </div>
          ))}
        </div>

        <a
          href="#chart"
          className="mt-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'linear-gradient(120deg,#fff2e8,#f3e9ff)', border: '1px dashed rgba(255,150,120,0.5)' }}
        >
          <span className="text-[11.5px] text-[#7c59cf]">
            ☕ <b className="font-semibold">커피 한 잔 값 {CHARACTER_FIRST_PRICE.toLocaleString('ko-KR')}원</b>으로 내 별 이야기
            시작하기
          </span>
          <span className="text-[13px] text-[#b07ac9]" aria-hidden="true">
            →
          </span>
        </a>
      </section>

      {/* 입력 */}
      <section id="chart" className="mx-auto mt-12 max-w-5xl scroll-mt-20 px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <SectionLabel index="✧">YOUR STARS</SectionLabel>
            <h2 className="t-display mt-3 text-[23px] leading-[1.5] text-[#4d3a6d]">
              별은 이미 떠 있어.
              <br />
              <span className="text-[#8f6fe0]">네가 태어난 순간</span>만 알려줘.
            </h2>
            <p className="mt-3 max-w-[320px] text-[12px] leading-[1.9] text-[#6a5788]">
              양력·음력, 윤달, 태어난 시간까지 보정해서 그려. 시간을 몰라도 괜찮아 — 정오 기준으로 별을 놓아줄게.
            </p>
            <div className="mt-5 space-y-2.5">
              {['수호별과 성격의 결', '12개 별방 이야기', '올해 조심할 별방 하나'].map((t, i) => (
                <p key={t} className="flex items-center gap-2 text-[11.5px] text-[#7c6a99]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px]" style={{ background: 'rgba(143,111,224,0.12)', color: '#7c59cf' }}>
                    {i + 1}
                  </span>
                  {t}
                </p>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <BirthForm onSubmit={onSubmit} onSample={onSample} />
          </div>
        </div>
      </section>

      {/* 내일 운세 배너 */}
      <section className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
        <div
          className="flex flex-col items-start justify-between gap-4 rounded-[26px] p-5 sm:flex-row sm:items-center"
          style={{ background: 'linear-gradient(120deg,#ffe6d6 0%,#f1e4ff 55%,#e6d8ff 100%)', border: '1px solid rgba(255,255,255,0.7)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[26px]" aria-hidden="true">
              🗓️
            </span>
            <div>
              <p className="t-display text-[14px] text-[#4d3a6d]">내일의 운세도 궁금하다면?</p>
              <p className="mt-0.5 text-[11px] text-[#6a5788]">행운이 가득한 하루를 미리 준비해 보세요.</p>
            </div>
          </div>
          <a href="#chart" className="t-btn t-btn-primary w-full px-5 py-3 text-[12px] sm:w-auto">
            운세 보기
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* 2027 정미년 신년 부적 — 무료 퍼널 입구 */}
      <section className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
        <NewYearBanner onStart={onNewYear} />
      </section>

      {/* REPORTS */}
      <section id="reports" className="mx-auto mt-14 max-w-5xl scroll-mt-20 px-5 sm:px-8">
        <SectionLabel index="✧">STORY BOOKS</SectionLabel>
        <h2 className="t-display mt-3 text-[23px] text-[#4d3a6d]">별 이야기 다섯 권</h2>
        <p className="mt-2 max-w-[360px] text-[12px] leading-[1.9] text-[#6a5788]">
          동양 자미두수 세 권, 서양 점성술 두 권. 첫 이야기는{' '}
          <b className="font-semibold text-[#7c59cf]">커피 한 잔 값({CHARACTER_FIRST_PRICE.toLocaleString('ko-KR')}원)</b>이야.
          가볍게 시작하고, 더 궁금할 때만 다음 책을 펼쳐.
        </p>

        <div className="mt-5 space-y-6">
          {[
            { label: '① 동양 전통 자미두수 · 12궁 명반', items: ZIWEI_PRODUCTS },
            { label: '② 서양 점성술 · 출생 천궁도', items: WESTERN_PRODUCTS },
          ].map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#5b4382]">{group.label}</span>
                <span className="h-px flex-1" style={{ background: 'rgba(146,116,192,0.22)' }} />
              </div>
              <div className="mt-2.5 grid gap-3.5 sm:grid-cols-3">
          {group.items.map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col p-5"
              style={
                p.recommended
                  ? { borderRadius: '26px', background: 'linear-gradient(160deg,#6a52a6,#4a3578)', color: '#fff9ff', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 24px 44px -30px rgba(78,54,120,0.7)' }
                  : { borderRadius: '26px', background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(146,116,192,0.16)', boxShadow: '0 18px 34px -28px rgba(112,80,164,0.5)', color: '#4d3a6d' }
              }
            >
              {productBadge(p, 'character') && (
                <span
                  className="absolute -top-2.5 left-5 rounded-full px-2.5 py-1 text-[9px] font-semibold"
                  style={{ background: p.id === 'basic' ? '#ffd9c7' : '#ffe0b8', color: '#5b4382' }}
                >
                  {productBadge(p, 'character')}
                </span>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="t-display text-[14.5px] leading-snug">{p.name}</h3>
                <span className="text-[9px]" style={{ color: p.recommended ? 'rgba(255,249,255,0.72)' : '#8f81a8' }}>
                  {p.hanja}
                </span>
              </div>
              <p className="mt-1.5 text-[11px]" style={{ color: p.recommended ? 'rgba(255,249,255,0.88)' : '#6a5788' }}>
                {productTagline(p, 'character')}
              </p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="num text-[21px] font-bold">{productPrice(p, 'character').toLocaleString('ko-KR')}원</span>
                {productOriginalPrice(p, 'character') && (
                  <span className="num text-[10px] line-through" style={{ color: p.recommended ? 'rgba(255,249,255,0.8)' : '#8f81a8' }}>
                    {productOriginalPrice(p, 'character')!.toLocaleString('ko-KR')}원
                  </span>
                )}
              </div>
              {p.id === 'basic' && (
                <p className="mt-1 text-[10px] text-[#b07ac9]">☕ 커피 한 잔 값, 부담 없이 시작해</p>
              )}
              <ul className="mt-3 flex-1 space-y-1.5 text-[11px] leading-relaxed" style={{ color: p.recommended ? 'rgba(255,249,255,0.82)' : '#7c6a99' }}>
                {productPoints(p, 'character').slice(0, 3).map((pt) => (
                  <li key={pt} className="flex gap-1.5">
                    <span style={{ color: p.recommended ? '#ffd9b8' : '#b395f5' }}>✧</span>
                    {pt}
                  </li>
                ))}
              </ul>
              {productScopeShort(p, 'character') && (
                <p
                  className="mt-2 text-[10px] leading-[1.65]"
                  style={{ color: p.recommended ? 'rgba(255,249,255,0.8)' : '#75628f' }}
                >
                  {productScopeShort(p, 'character')}
                </p>
              )}
              <button
                onClick={() => onProduct(p.id)}
                className={`t-btn mt-4 w-full py-2.5 text-[11.5px] ${p.recommended ? 't-btn-gold' : 't-btn-soft'}`}
              >
                {productCta(p, 'character')}
              </button>
            </div>
          ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[10.5px] text-[#75628f]">
          1회 결제 · 언제든 다시 보기 · 별지도는 서버에 저장하지 않아
        </p>
        <div className="mt-3 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.7)', border: '1px dashed rgba(146,116,192,0.25)' }}>
          <p className="text-[10.5px] leading-[1.8] text-[#6a5788]">
            곧 · <b className="text-[#7c59cf]">매달 1일 월간 별빛 편지</b>(구독)가 열려. 서양 별자리까지 함께 읽는{' '}
            <b className="text-[#7c59cf]">통합 리포트</b>는 위에서 바로 결제할 수 있어.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
        <div className="t-card p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <StarMark className="h-3 w-3" />
            <h2 className="t-display text-[18px] text-[#4d3a6d]">가디언에게 물어보기</h2>
          </div>
          <div className="mt-3 divide-y" style={{ borderColor: 'rgba(146,116,192,0.1)' }}>
            {[
              { q: '태어난 시간을 몰라도 돼?', a: '응! 정오(오시) 기준으로 계산하고, 수호별이 달라질 수 있다는 것도 같이 알려줄게.' },
              { q: '음력 생일인데 그대로 넣어도 돼?', a: '당연하지. 한국 음력 기준으로 양력 변환해서 그리고, 윤달도 선택할 수 있어.' },
              { q: '결제하면 뭐가 열려?', a: '커피 한 잔 값 이야기(3,900원)는 수호별·성격, 연애·배우자상, 진로·전공, 돈이 새는 장면까지 핵심만 열려. 12개 별방 전체랑 달마다 처방은 전체 별 이야기(12,900원)에서 볼 수 있어.' },
            ].map((f) => (
              <details key={f.q} className="group py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12.5px] font-medium text-[#5b4382]">
                  {f.q}
                  <span className="text-[14px] text-[#b395f5] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 pr-6 text-[11.5px] leading-[1.9] text-[#6a5788]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      <footer className="mt-10 pb-24 sm:pb-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="guardian-avatar h-7 w-7">
              <img src={THEME_ART.character.hero} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="t-display text-[14px] text-[#6b568c]">{copy.brand.name}</span>
            <span className="text-[10px] text-[#c9b6e4]">✧</span>
          </div>
          <p className="mt-2 text-[10.5px] leading-[1.9] text-[#75628f]">
            {system === 'western'
              ? '서양 점성술은 오락과 자기 이해를 위한 콘텐츠야. 의료·법률·투자 같은 중요한 결정의 근거로는 쓸 수 없어. 출생지는 서울 기준으로 계산했어.'
              : '자미두수는 전통 상담 문화야. 이 이야기는 오락과 자기 이해를 위한 콘텐츠이고, 의료·법률·투자 같은 중요한 결정의 근거로는 쓸 수 없어.'}
            <br />© 2026 {copy.brand.name}. 프로토타입.
          </p>
        </div>
      </footer>
    </div>
  );
}
