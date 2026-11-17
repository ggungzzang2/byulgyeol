import { useState } from 'react';
import type { ChartModel } from '../lib/chart';
import { amuletShareText, build2027 } from '../lib/newyear2027';
import { downloadAmulet, renderAmulet2027 } from '../lib/amuletCard';
import { findProduct, productPrice, productUnlockCta } from '../lib/products';
import { useTheme } from '../lib/theme';
import FreeOpenMeter from './FreeOpenMeter';
import StoneGoods2027 from './StoneGoods2027';
import { ArrowIcon, LockIcon, SectionLabel } from './ui';

type Props = {
  chart: ChartModel;
  /** 2027 정밀 리포트를 이미 연 상태 */
  unlocked: boolean;
  onUnlock: () => void;
};

export default function NewYear2027({ chart, unlocked, onUnlock }: Props) {
  const { theme, copy } = useTheme();
  const isCharacter = theme === 'character';
  const content = build2027(chart, theme);
  const price = productPrice(findProduct('newyear2027'), theme);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const saveCard = async () => {
    setSaving(true);
    try {
      const url = await renderAmulet2027(chart, content, theme);
      downloadAmulet(url, `별의속삭임_2027정미년_부적_${chart.primaryStar}.png`);
      flash(isCharacter ? '2027 부적 카드를 저장했어! (1080×1620)' : '2027 부적 카드를 저장했습니다. (1080×1620)');
    } catch {
      flash(isCharacter ? '카드를 저장하지 못했어. 한 번만 다시 해볼게!' : '카드 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  const share = async () => {
    const text = amuletShareText(chart, content);
    try {
      if (navigator.share) {
        await navigator.share({ title: '2027 정미년 신년 부적', text });
        return;
      }
      await navigator.clipboard.writeText(text);
      flash(isCharacter ? '부적 문구를 복사했어. 원하는 곳에 붙여넣어 줘!' : '부적 문구를 복사했습니다.');
    } catch {
      flash(isCharacter ? '공유를 그만뒀어.' : '공유를 취소했습니다.');
    }
  };

  const previewMonths = content.months.slice(0, 3);
  const lockedMonths = content.months.slice(3);

  return (
    <section id="newyear2027" className="mt-12 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel index="2027">NEW YEAR · 신년 부적</SectionLabel>
        <span className="t-chip shrink-0 whitespace-nowrap !text-[10.5px]">무료</span>
      </div>
      <h2 className="t-display mt-3 text-[23px] leading-[1.4] sm:text-[27px]">
        {isCharacter ? (
          <>
            2027 정미년, 네 몫의 부적
            <br className="sm:hidden" /> 한 장
          </>
        ) : (
          '2027 정미년, 당신 몫의 부적 한 장'
        )}
      </h2>
      <p className="mt-2 max-w-[440px] text-[11.5px] leading-[1.85] t-muted">
        {isCharacter
          ? '명궁의 별과 2027년 사화로 그린 소장용 부적이야. 저장해서 두고 봐도 되고, 핵심 흐름만 먼저 볼 수도 있어.'
          : '명궁의 주성과 2027년 유년 사화로 그린 소장용 부적입니다. 저장해 두고 보시거나, 핵심 흐름만 먼저 확인하실 수 있습니다.'}
      </p>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        {/* 부적 카드 */}
        <div>
          <div
            className="relative overflow-hidden rounded-[24px] px-5 py-6"
            style={{
              background: 'linear-gradient(168deg,#0c0a18 0%,#151029 46%,#08070f 100%)',
              border: '1px solid rgba(227,192,123,0.42)',
              boxShadow: '0 28px 60px -34px rgba(9,8,18,0.92)',
            }}
          >
            {/* 별가루 */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.55]"
              style={{
                background:
                  'radial-gradient(circle at 22% 18%, rgba(255,250,238,0.9) 0.6px, transparent 1.6px), radial-gradient(circle at 74% 26%, rgba(255,250,238,0.7) 0.7px, transparent 1.8px), radial-gradient(circle at 36% 64%, rgba(227,192,123,0.8) 0.6px, transparent 1.8px), radial-gradient(circle at 84% 72%, rgba(255,250,238,0.6) 0.7px, transparent 1.8px), radial-gradient(circle at 58% 88%, rgba(227,192,123,0.5) 0.6px, transparent 1.6px)',
                backgroundRepeat: 'repeat',
                backgroundSize: '190px 190px',
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -top-16 right-[-30px] h-56 w-56 rounded-full"
              style={{ background: `radial-gradient(closest-side, ${content.stone.colorSoft}, transparent 72%)` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-[10px] rounded-[18px]"
              style={{ border: '1px solid rgba(227,192,123,0.26)' }}
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px]" style={{ color: 'rgba(246,238,224,0.82)', fontFamily: 'var(--font-display)' }}>
                  {isCharacter ? '별의 속삭임' : '자미원'}
                </span>
                <span className="text-[8.5px] tracking-[0.14em]" style={{ color: 'rgba(246,238,224,0.5)' }}>
                  동양 전통 자미두수 · 12궁 명반
                </span>
              </div>

              <div className="mt-3 h-px w-full" style={{ background: 'rgba(227,192,123,0.22)' }} />

              <p className="mt-5 text-center text-[9.5px] tracking-[0.34em]" style={{ color: 'rgba(227,192,123,0.9)' }}>
                2027 NEW YEAR AMULET
              </p>

              <div className="mt-1 text-center leading-none">
                <span
                  className="block text-[68px] font-semibold"
                  style={{
                    fontFamily: '"Noto Serif KR", Georgia, serif',
                    backgroundImage: 'linear-gradient(180deg,#fbf0d6,#e3c07b 55%,#c19a56)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {content.hanja.split('').map((ch) => (
                    <span key={ch} className="block">
                      {ch}
                    </span>
                  ))}
                </span>
              </div>

              <p className="mt-3 text-center text-[14px]" style={{ color: 'rgba(246,238,224,0.95)', fontFamily: 'var(--font-display)' }}>
                {content.stemBranch}년 · {content.animal}의 해
              </p>
              <p className="mt-1 text-center text-[10.5px]" style={{ color: 'rgba(246,238,224,0.6)' }}>
                {chart.name ? `${chart.name} 님의` : '나의'} 신년 부적 · {chart.primaryStar}
                {isCharacter ? '별' : '성'}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {content.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full px-2.5 py-1 text-[10px]"
                    style={{ border: '1px solid rgba(227,192,123,0.45)', color: 'rgba(246,238,224,0.94)' }}
                  >
                    ✧ {k}
                  </span>
                ))}
              </div>

              <p
                className="mx-auto mt-5 max-w-[300px] text-center text-[12.5px] leading-[1.9]"
                style={{ color: 'rgba(248,241,228,0.94)', fontFamily: '"Noto Serif KR", Georgia, serif' }}
              >
                {content.advice}
              </p>

              <div className="mt-5 h-px w-full" style={{ background: 'rgba(227,192,123,0.2)' }} />

              <div className="mt-4 flex items-center justify-center gap-2.5">
                <span
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${content.stone.colorHex} 46%, rgba(0,0,0,0.5) 100%)`,
                    boxShadow: `0 0 18px ${content.stone.colorHex}66`,
                  }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[11.5px]" style={{ color: 'rgba(248,241,228,0.95)' }}>
                    {content.stone.name}
                  </p>
                  <p className="text-[9.5px]" style={{ color: 'rgba(246,238,224,0.55)' }}>
                    보완 · {content.needLabel}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-[8.5px]" style={{ color: 'rgba(246,238,224,0.42)' }}>
                  2027. 1. 1 — 12. 31 · 소장용
                </p>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-md text-[15px]"
                  style={{
                    background: 'rgba(150,52,48,0.9)',
                    color: 'rgba(255,236,228,0.94)',
                    border: '1px solid rgba(240,200,190,0.55)',
                    fontFamily: '"Noto Serif KR", Georgia, serif',
                  }}
                  aria-hidden="true"
                >
                  守
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <button onClick={saveCard} disabled={saving} className="t-btn t-btn-primary !px-4 !py-2.5 text-[11.5px]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 4v11M7.5 11L12 15.5 16.5 11M5 19h14" />
              </svg>
              {saving ? (isCharacter ? '그리는 중…' : '만드는 중…') : '부적 저장'}
            </button>
            <button onClick={share} className="t-btn t-btn-soft !px-4 !py-2.5 text-[11.5px]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="17.5" cy="6" r="2.5" />
                <circle cx="6.5" cy="12" r="2.5" />
                <circle cx="17.5" cy="18" r="2.5" />
                <path d="M8.7 10.9l6.6-3.6M8.7 13.1l6.6 3.6" />
              </svg>
              {copy.chart.share}
            </button>
          </div>
          <p className="mt-2 text-[9.5px] leading-[1.7] t-faint">{content.note}</p>
        </div>

        {/* 30% 프리뷰 → 정밀 리포트 */}
        <div className="t-panel p-6">
          <div className="t-starfield opacity-30" />
          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9.5px] tracking-[0.2em] t-panel-accent">2027 FLOW · 핵심 흐름</p>
              <span className="text-[9.5px]" style={{ color: 'var(--panel-faint)' }}>
                무료 부적 + 미리보기
              </span>
            </div>

            <div className="mt-3">
              <FreeOpenMeter
                freePercent={30}
                openItems={['2027 유년 명궁과 사화', '연애·금전·일 별빛 지수', '1~3월 흐름', '무료 신년 부적 카드']}
                lockedItems={['4~12월 아홉 달의 문', '부족한 기운과 보완 습관 셋', '수호 원석 처방', '월별로 할 일 한 줄']}
                volume="한 번 결제로 열두 달 전체가 열려"
                product={findProduct('newyear2027')}
              />
            </div>

            <p className="t-panel-title mt-3 text-[17px] leading-[1.6]">{content.headline}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full px-2.5 py-1 text-[10px]" style={{ border: '1px solid var(--panel-rule)', color: 'var(--panel-muted)' }}>
                유년 명궁 {content.stage.palace}
              </span>
              <span className="rounded-full px-2.5 py-1 text-[10px]" style={{ border: '1px solid var(--panel-rule)', color: 'var(--panel-muted)' }}>
                {content.age}세 · {content.yearElement}의 해
              </span>
              {content.mutagen.slice(0, 2).map((m) => (
                <span key={m.mutagen} className="rounded-full px-2.5 py-1 text-[10px]" style={{ border: '1px solid var(--panel-line)', color: 'var(--panel-accent)' }}>
                  {m.mutagen} {m.star}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl px-3 py-3.5" style={{ background: 'rgba(9,8,18,0.28)', border: '1px solid var(--panel-rule)' }}>
              {[
                { label: isCharacter ? '연애의 별' : '연애', value: content.scores.love },
                { label: isCharacter ? '금전의 별' : '금전', value: content.scores.money },
                { label: isCharacter ? '일의 별' : '일', value: content.scores.work },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="num text-[22px] font-bold leading-none" style={{ color: 'var(--panel-accent)' }}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[10.5px] t-panel-body">{s.label}</p>
                  <div className="mx-auto mt-2 h-[3px] w-[72%] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.16)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--panel-accent)' }} />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11.5px] leading-[1.85] t-panel-body">{content.flow.free}</p>
            <p className="mt-1.5 select-none text-[11.5px] leading-[1.85] blur-[4px]" style={{ color: 'var(--panel-faint)' }} aria-hidden="true">
              {content.flow.locked}
            </p>

            {/* 열두 달 중 앞 세 달만 공개 */}
            <div className="mt-4 space-y-1.5">
              {previewMonths.map((m) => (
                <div key={m.month} className="rounded-xl px-3 py-2.5" style={{ border: '1px solid var(--panel-rule)', background: 'rgba(9,8,18,0.22)' }}>
                  <div className="flex items-center gap-2">
                    <span className="num text-[10px] tracking-[0.08em] t-panel-accent">{String(m.month).padStart(2, '0')}월</span>
                    <span className="text-[11.5px] t-panel-title">{m.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-[1.7] t-panel-body">{m.body}</p>
                </div>
              ))}
              <div className="rounded-xl px-3 py-2.5" style={{ border: '1px dashed var(--panel-rule)' }}>
                <div className="flex items-center gap-2">
                  <LockIcon className="h-3 w-3 t-panel-faint" />
                  <span className="text-[11px] t-panel-faint">04월 — 12월 · 아홉 달의 문은 리포트에서 열려</span>
                </div>
                <p className="mt-1 select-none text-[11px] leading-[1.7] blur-[4px] t-panel-faint" aria-hidden="true">
                  {lockedMonths.map((m) => m.title).join(' · ')}
                </p>
              </div>
            </div>

            <button onClick={onUnlock} className="t-btn t-btn-gold mt-4 w-full py-3 text-[12.5px]">
              {unlocked ? (
                <>
                  2027 정밀 리포트 다시 보기
                  <ArrowIcon className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <LockIcon className="h-3.5 w-3.5" />
                  {isCharacter
                    ? `${price.toLocaleString('ko-KR')}원으로 2027 열두 달 열기`
                    : `2027 정밀 운세 리포트 ${price.toLocaleString('ko-KR')}원`}                </>
              )}
            </button>
            <p className="mt-2 text-[10px] leading-[1.7] t-panel-faint">
              {isCharacter
                ? '열두 달 흐름, 달마다 할 일, 보완 처방과 원석 굿즈까지 한 번에 이어져.'
                : '열두 달 흐름, 달마다 할 일, 보완 처방과 원석 굿즈까지 이어집니다.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <StoneGoods2027 goods={content.goods} needLabel={content.needLabel} stoneName={content.stone.name} />
      </div>

      {toast && (
        <div
          className="fixed bottom-16 left-1/2 z-40 -translate-x-1/2 animate-rise whitespace-nowrap rounded-full px-5 py-3 text-[11.5px] shadow-lg"
          style={{ background: 'var(--panel-bg)', color: 'var(--panel-text)', border: '1px solid var(--panel-line)' }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}
