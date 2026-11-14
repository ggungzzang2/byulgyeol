import type { WesternModel } from '../lib/western';
import {
  ELEMENT_MEANING,
  PLANET_INFO,
  SIGNS,
  aspectText,
  houseReading,
  westernIdentityLines,
} from '../lib/western';
import { WESTERN_PRODUCTS, productBadge, productCta, productPoints, productPrice, productShortCta, productTagline, type ProductId } from '../lib/products';
import { useTheme } from '../lib/theme';
import NatalWheel from './NatalWheel';
import SystemTabs from './SystemTabs';
import type { SystemId } from '../lib/systems';
import { SectionLabel, StarMark } from './ui';

type Props = {
  model: WesternModel;
  onSystemChange: (system: SystemId) => void;
  onReset: () => void;
  onUnlock: (id: ProductId) => void;
};

/** 서양 점성술 무료 결과 — 자미두수 결과 화면과 완전히 분리된 동선입니다. */
export default function WesternView({ model, onSystemChange, onReset, onUnlock }: Props) {
  const { theme } = useTheme();
  const isCharacter = theme === 'character';
  const sunSign = SIGNS[model.sun.signIndex];
  const moonSign = SIGNS[model.moon.signIndex];
  const identity = westernIdentityLines(model);
  const topAspects = model.aspects.slice(0, 5);

  return (
    <div className="min-h-screen pb-28">
      {/* 상단 바 */}
      <div
        className="sticky top-0 z-30 no-print"
        style={{
          borderBottom: '1px solid var(--line)',
          background: theme === 'character' ? 'rgba(255,255,255,0.92)' : 'rgba(9,8,18,0.92)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <StarMark className="h-3.5 w-3.5 shrink-0" />
            <span className="t-title shrink-0 text-[15px] tracking-[0.1em]">서양 점성술</span>
            <span className="hidden h-3 w-px sm:block" style={{ background: 'var(--line-strong)' }} />
            <span className="hidden truncate text-[11.5px] t-muted sm:inline">
              {model.name ? `${model.name} 님의 ` : ''}출생 천궁도 · {model.solarText}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={onReset} className="t-btn t-btn-ghost !px-3.5 !py-2 text-[11.5px]">
              다시 입력
            </button>
            <button onClick={() => onUnlock('western')} className="t-btn t-btn-primary !px-3.5 !py-2 text-[11.5px]">
              천궁도 리포트
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8">
        {/* 지금 보고 있는 체계 */}
        <SystemTabs
          system="western"
          onChange={onSystemChange}
          note="지금 보고 있는 체계: 서양 점성술 · 출생 천궁도(행성 하우스). 같은 입력으로 동양 자미두수 12궁도 볼 수 있어요."
        />

        {/* 태양 · 달 · 어센던트 */}
        <section className="mt-6 animate-rise">
          <SectionLabel index="01">출생 천궁도 · NATAL</SectionLabel>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="t-panel p-6 sm:p-8">
              <div className="t-starfield opacity-40" />
              <div className="relative">
                <p className="text-[11px] tracking-[0.2em] t-panel-accent">서양 점성술 · 출생 천궁도</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: '태양 자리', sign: sunSign, glyph: '☉' },
                    { label: '달 자리', sign: moonSign, glyph: '☾' },
                    { label: '어센던트', sign: model.rising, glyph: 'ASC' },
                  ].map((c) => (
                    <div key={c.label} className="rounded-2xl px-2 py-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--panel-rule)' }}>
                      <p className="text-[9px] tracking-[0.12em] t-panel-faint">{c.glyph}</p>
                      <p className="t-panel-title mt-1 text-[15px] leading-tight">{c.sign.name}</p>
                      <p className="mt-1 text-[9.5px] t-panel-faint">{c.label}</p>
                    </div>
                  ))}
                </div>

                <h2 className="t-panel-title mt-5 text-[26px] leading-snug sm:text-[30px]">
                  태양 {sunSign.name}
                  <span className="ml-1.5 text-[20px] font-light opacity-70">{sunSign.glyph}</span>
                </h2>
                <p className="mt-1 text-[11.5px] t-panel-accent">
                  {sunSign.keyword} · {sunSign.element}의 기운 · 수호 행성 {sunSign.ruler}
                </p>

                <div className="mt-4 space-y-2">
                  {identity.map((line) => (
                    <p key={line} className="text-[12.5px] leading-[1.9] t-panel-body">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl px-3 py-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-rule)' }}>
                  {[
                    { label: '연애의 별', value: model.indices.love },
                    { label: '금전의 별', value: model.indices.money },
                    { label: '일의 별', value: model.indices.work },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="num text-[26px] font-bold leading-none" style={{ color: 'var(--panel-accent)' }}>
                        {s.value}
                      </p>
                      <p className="mt-1.5 text-[11.5px] t-panel-body">{s.label}</p>
                      <div className="mx-auto mt-2 h-[4px] w-[70%] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>
                        <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--panel-accent)' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="num mt-3 text-[10px] t-panel-faint">
                  {model.solarText} {model.timeText} · 출생지 {model.birthPlace}
                </p>
                {(!model.timeKnown || model.note) && (
                  <p className="mt-1 text-[10px] leading-relaxed t-panel-faint">
                    {!model.timeKnown && '태어난 시간을 몰라 어센던트·하우스를 정오 기준으로 계산했습니다. '}
                    {model.note}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="t-card p-5">
                <p className="text-[9.5px] tracking-[0.18em] t-faint">CHART WHEEL · 천궁도</p>
                <div className="mt-3 flex justify-center">
                  <NatalWheel model={model} size={268} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {model.planets.map((p) => (
                    <div key={p.key} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1" style={{ background: 'var(--field-bg)' }}>
                      <span className="text-[10.5px] t-muted">
                        <span style={{ color: 'var(--accent)' }}>{p.glyph}</span> {p.name}
                      </span>
                      <span className="num text-[10.5px] t-body">
                        {p.signName} · {p.house}H
                        {p.retrograde ? ' R' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="t-card p-5">
                <p className="text-[9.5px] tracking-[0.18em] t-faint">ELEMENT · 원소 균형</p>
                <div className="mt-3 space-y-2">
                  {model.elements.map((e) => (
                    <div key={e.element}>
                      <div className="flex justify-between text-[10.5px] t-muted">
                        <span>{ELEMENT_MEANING[e.element]}</span>
                        <span className="num">{e.count}</span>
                      </div>
                      <div className="mt-1 h-[4px] overflow-hidden rounded-full" style={{ background: 'var(--field-bg)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, e.count * 12)}%`, background: 'var(--accent)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10.5px] leading-relaxed t-faint">
                  가장 강한 기운은 <b style={{ color: 'var(--accent-deep)' }}>{model.dominantElement}</b>.{' '}
                  {model.dominantElement === '불' && '추진력은 좋지만 마무리를 옆 사람에게 맡기면 오래갑니다.'}
                  {model.dominantElement === '흙' && '현실 감각이 강합니다. 대신 새로운 시도에 한 박자 늦습니다.'}
                  {model.dominantElement === '공기' && '말과 정보로 길을 엽니다. 감정의 말을 따로 연습해 보세요.'}
                  {model.dominantElement === '물' && '공기를 잘 읽습니다. 대신 경계를 정해두지 않으면 지칩니다.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 세 좌표 해설 */}
        <section className="mt-12">
          <SectionLabel index="02">SUN · MOON · RISING</SectionLabel>
          <h2 className="t-display mt-3 text-[22px] sm:text-[26px]">세 개의 좌표가 말하는 것</h2>
          <div className="mt-4 grid gap-3.5 lg:grid-cols-3">
            {[
              { glyph: '☉', title: `태양 ${sunSign.name}`, means: '나의 중심과 의지', text: sunSign.identity, extra: sunSign.shadow, extraLabel: '그림자' },
              { glyph: '☾', title: `달 ${moonSign.name}`, means: '감정과 안전 욕구', text: moonSign.identity, extra: moonSign.love, extraLabel: '위로받는 방식' },
              { glyph: 'ASC', title: `어센던트 ${model.rising.name}`, means: '첫인상과 시작 방식', text: model.rising.identity, extra: model.rising.work, extraLabel: '일할 때의 인상' },
            ].map((c) => (
              <div key={c.title} className="t-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[18px]" style={{ color: 'var(--accent)' }} aria-hidden="true">
                    {c.glyph}
                  </span>
                  <span className="text-[9px] tracking-[0.16em] t-faint">{c.means}</span>
                </div>
                <p className="t-title mt-3 text-[16px]">{c.title}</p>
                <p className="mt-2 text-[12px] leading-[1.85] t-muted">{c.text}</p>
                <p className="mt-3 border-t pt-3 text-[11px] leading-[1.8] t-faint" style={{ borderColor: 'var(--line)' }}>
                  <b style={{ color: 'var(--accent-deep)' }}>{c.extraLabel} </b>
                  {c.extra}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 행성 배치 */}
        <section className="mt-12">
          <SectionLabel index="03">PLANETS</SectionLabel>
          <h2 className="t-display mt-3 text-[22px] sm:text-[26px]">행성 7개가 앉은 자리</h2>
          <p className="mt-2 text-[11.5px] t-muted">행성 = 무엇이, 자리 = 어떻게, 하우스 = 어느 영역에서.</p>
          <div className="mt-4 overflow-hidden rounded-2xl" style={{ border: '1px solid var(--line)' }}>
            {model.planets.map((p, i) => (
              <div
                key={p.key}
                className="grid grid-cols-[1.05fr_1fr_0.8fr] items-center gap-2 px-3 py-2.5"
                style={{ background: i % 2 ? 'var(--card-2)' : 'transparent', borderTop: i ? '1px solid var(--line)' : undefined }}
              >
                <div>
                  <p className="text-[12px] font-semibold t-body">
                    <span style={{ color: 'var(--accent)' }}>{p.glyph}</span> {p.name}
                    {p.retrograde && <span className="ml-1 text-[9px] t-faint">역행</span>}
                  </p>
                  <p className="mt-0.5 text-[9.5px] t-faint">{PLANET_INFO[p.key].means}</p>
                </div>
                <p className="text-[11.5px] t-body">
                  {p.signName} <span className="num text-[9.5px] t-faint">{p.degreeInSign}°</span>
                </p>
                <p className="num text-right text-[11px] t-muted">{p.house}하우스</p>
              </div>
            ))}
          </div>
        </section>

        {/* 12하우스 요약 */}
        <section className="mt-12">
          <SectionLabel index="04">TWELVE HOUSES</SectionLabel>
          <h2 className="t-display mt-3 text-[22px] sm:text-[26px]">하늘을 나눈 열두 칸</h2>
          <p className="mt-2 max-w-[420px] text-[11.5px] leading-[1.85] t-muted">
            어센던트 자리부터 한 칸씩 — 하우스는 삶의 영역입니다. 행성이 앉은 칸이 유난히 자주 다뤄지는 자리예요.
            하우스는 어센던트 자리부터 사인 하나씩 나누는 Whole Sign 방식으로 계산했습니다.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {model.houses.map((h) => (
              <div
                key={h.index}
                className="rounded-2xl p-3.5"
                style={{
                  background: h.planets.length ? 'var(--accent-soft)' : 'var(--card-2)',
                  border: h.planets.length ? '1px solid var(--line-strong)' : '1px solid var(--line)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11.5px] font-semibold t-body">
                    {h.index} · {h.desc}
                  </p>
                  <span className="num text-[9.5px] t-faint">{h.signName}</span>
                </div>
                <p className="mt-1 text-[10px] t-faint">
                  {h.planets.length ? h.planets.join(' · ') : '비어 있는 칸'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 주요 각 */}
        {topAspects.length > 0 && (
          <section className="mt-12">
            <SectionLabel index="05">ASPECTS</SectionLabel>
            <h2 className="t-display mt-3 text-[22px] sm:text-[26px]">행성 사이의 각</h2>
            <div className="mt-4 space-y-2">
              {topAspects.map((a) => (
                <p
                  key={`${a.a}-${a.b}-${a.type}`}
                  className="rounded-xl px-3.5 py-2.5 text-[11.5px] leading-[1.8] t-muted"
                  style={{ background: 'var(--card-2)', border: '1px solid var(--line)' }}
                >
                  {aspectText(a)}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 잠금 영역 */}
        <section className="mt-12">
          <div className="t-panel p-6 sm:p-8">
            <div className="t-starfield opacity-40" />
            <div className="relative">
              <p className="text-[9.5px] tracking-[0.22em] t-panel-accent">LOCKED · 서양 점성술 리포트</p>
              <h2 className="t-panel-title mt-3 text-[21px] leading-[1.45] sm:text-[25px]">
                하우스별 풀이와 각 해석까지
                <br />
                이어서 읽기
              </h2>
              <p className="mt-3 max-w-[520px] text-[11.5px] leading-[1.85] t-panel-body">
                무료 화면에서는 태양·달·어센던트와 행성의 자리까지만 열립니다. 12개 하우스 풀이, 행성 사이의 각
                전체, 금전·연애·일 지수의 근거는 서양 점성술 리포트에서 이어집니다.
              </p>

              <div className="mt-4 grid gap-2">
                {model.houses.slice(0, 2).map((h) => (
                  <p key={h.index} className="select-none rounded-xl px-3 py-2 text-[11.5px] leading-[1.8] blur-[4px]" style={{ border: '1px solid var(--panel-rule)', color: 'var(--panel-body)' }} aria-hidden="true">
                    {houseReading(model, h)}
                  </p>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => onUnlock('western')} className="t-btn t-btn-gold px-5 py-3 text-[12.5px]">
                  서양 점성술 리포트 열기 · {productPrice(WESTERN_PRODUCTS[0], theme).toLocaleString('ko-KR')}원
                </button>
                <button onClick={() => onUnlock('bundle')} className="t-btn t-btn-onpanel px-4 py-3 text-[11.5px]">
                  동양 + 서양 통합으로 보기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 서양 상품 */}
        <section className="mt-12">
          <SectionLabel index="REPORTS">WESTERN REPORTS</SectionLabel>
          <h2 className="t-display mt-3 text-[22px]">서양 점성술 리포트</h2>
          <p className="mt-2 text-[11.5px] t-muted">
            아래 두 상품은 서양 점성술 동선입니다. 자미두수 리포트는 위쪽 ‘동양 자미두수’ 탭에서 결제할 수 있어요.
          </p>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            {WESTERN_PRODUCTS.map((p) => (
              <div key={p.id} className="t-card flex flex-col p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="t-title text-[15px]">{p.name}</h3>
                  {productBadge(p, theme) && <span className="t-chip !text-[9.5px]">{productBadge(p, theme)}</span>}
                </div>
                <p className="mt-1 text-[11px] t-muted">{productTagline(p, theme)}</p>
                <ul className="mt-3 flex-1 space-y-1.5 text-[11.5px] leading-relaxed t-muted">
                  {productPoints(p, theme).slice(0, 3).map((pt) => (
                    <li key={pt} className="flex gap-1.5">
                      <span style={{ color: 'var(--accent)' }}>·</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="num text-[15px] font-semibold t-title">
                    {productPrice(p, theme).toLocaleString('ko-KR')}
                    <span className="ml-0.5 text-[0.72em] font-normal t-muted">원</span>
                  </span>
                  <button onClick={() => onUnlock(p.id)} className="t-btn t-btn-soft !px-3.5 !py-2 text-[11.5px]">
                    {productShortCta(p, theme)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-9 text-center text-[10.5px] leading-[1.9] t-faint">
          {isCharacter ? '서양 점성술' : '西洋占星術'}은 오락과 자기 이해를 위한 콘텐츠입니다. 의료·법률·투자 판단의 근거가 아닙니다.
          출생지는 서울 기준으로 계산했습니다.
        </p>
      </div>
    </div>
  );
}
