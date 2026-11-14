import { useState } from 'react';
import type { ChartModel } from '../lib/chart';
import { useTheme } from '../lib/theme';
import { buildChartSummaryText } from '../services/aiReport';
import { SectionLabel } from './ui';

export default function MonthlyUpsell({ chart }: { chart: ChartModel }) {
  const { theme } = useTheme();
  const isCharacter = theme === 'character';
  const [copied, setCopied] = useState(false);
  const [joined, setJoined] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(buildChartSummaryText(chart));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="next" className="mt-14 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel index="NEXT">NEXT LINEUP</SectionLabel>
          <h2 className="t-display mt-3 text-[22px] leading-[1.4] sm:text-[26px]">
            {isCharacter ? (
              <>
                곧, 매달 찾아오는
                <br className="sm:hidden" /> 별빛 편지
              </>
            ) : (
              '다음에 열릴 두 개의 문'
            )}
          </h2>
        </div>
        <span className="t-chip !text-[10px]">구독 · 통합 리포트 준비 중</span>
      </div>

      <div className="mt-4 grid gap-3.5 lg:grid-cols-2">
        {/* 월간 구독 */}
        <div className="t-card flex flex-col p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9.5px] tracking-[0.2em]" style={{ color: 'var(--accent-deep)' }}>
              MONTHLY · 구독형
            </p>
            <span className="t-chip !text-[9.5px]">출시 예정</span>
          </div>
          <h3 className="t-title mt-2.5 text-[18px] leading-snug">
            {isCharacter ? '월간 별자리 리포트' : '월간 별자리 리포트'}
            <span className="ml-1.5 text-[10px] font-normal t-faint">월 1회</span>
          </h3>
          <p className="mt-2 text-[11.5px] leading-[1.9] t-muted">
            매달 1일, 이번 달의 흐름을 네 장으로 정리해 보내드립니다. 재물·연애·일·건강의 이번 달
            별빛 처방과 조심할 날짜, 그리고 딱 하나의 행동을 담습니다.
          </p>
          <ul className="mt-3 flex-1 space-y-1.5 text-[11px] leading-relaxed t-muted">
            {[
              '이번 달 조심할 날 3일 (달력 표시)',
              '재물·연애·일·건강 4장 처방',
              '내 명반 변화와 대한·유년 업데이트',
            ].map((t) => (
              <li key={t} className="flex gap-1.5">
                <span style={{ color: 'var(--accent)' }}>·</span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[9.5px] t-faint">가격 미정 · 결제 연동 전</p>
          <button
            onClick={() => setJoined(true)}
            disabled={joined}
            className={`t-btn mt-3 w-full py-2.5 text-[11.5px] ${joined ? 't-btn-soft' : 't-btn-ghost'}`}
          >
            {joined ? '대기 명단 등록됨 ✓' : '월간 리포트 대기 명단 등록'}
          </button>
        </div>

        {/* 동양 + 서양 통합 */}
        <div className="t-panel flex flex-col p-6">
          <div className="t-starfield opacity-30" />
          <div className="relative flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9.5px] tracking-[0.2em] t-panel-accent">EAST × WEST · 통합</p>
              <span className="rounded-full px-2 py-0.5 text-[9px]" style={{ border: '1px solid var(--panel-rule)', color: 'var(--panel-faint)' }}>
                확장 예정
              </span>
            </div>
            <h3 className="t-panel-title mt-2.5 text-[18px] leading-snug">
              자미두수 × 서양 네이탈 차트
              <br />
              통합 AI 리포트
            </h3>
            <p className="mt-2 text-[11.5px] leading-[1.9] t-panel-body">
              윈다다·Astro-Seek에서 명반을 복사해 GPT에 넣던 방식, 그대로입니다. 다만 여기서는 동양
              12궁과 서양 출생 차트를 함께 놓고 교차 해석합니다. 두 체계가 같은 지점을 가리킬 때
              가장 정확한 문장이 나옵니다.
            </p>

            <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(9,8,18,0.28)', border: '1px solid var(--panel-rule)' }}>
              <p className="text-[10px] leading-[1.7] t-panel-faint">
                지금도 내 명반 데이터를 AI 프롬프트로 한 번에 복사해 다른 AI에서 시험해 볼 수 있습니다.
              </p>
            </div>

            <button onClick={copyPrompt} className="t-btn t-btn-gold mt-auto w-full py-2.5 text-[11.5px] !mt-4">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
              </svg>
              {copied ? 'AI 프롬프트 복사됨 ✓' : '내 명반 AI 프롬프트 원클릭 복사'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
