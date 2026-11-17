import { useCallback, useEffect, useState } from 'react';
import type { BirthInput, ChartModel } from './lib/chart';
import { SAMPLE_INPUT, buildChart } from './lib/chart';
import type { WesternModel } from './lib/western';
import { buildWestern } from './lib/western';
import { PRODUCTS, findProduct, type Product, type ProductId } from './lib/products';
import { readSystemFromUrl, writeSystemToUrl, type SystemId } from './lib/systems';
import { ThemeProvider, readThemeFromUrl, type ThemeId } from './lib/theme';
import Landing from './components/Landing';
import ChartView from './components/ChartView';
import CheckoutModal from './components/CheckoutModal';
import PremiumReport from './components/PremiumReport';
import CompatReport from './components/CompatReport';
import CompatPreview from './components/CompatPreview';
import WesternView from './components/WesternView';
import WesternReport from './components/WesternReport';
import NewYearReport from './components/NewYearReport';
import ThemeToggle from './components/ThemeToggle';

type View = 'landing' | 'chart' | 'report' | 'compat' | 'western' | 'westernReport' | 'newyear2027';

export default function App() {
  const [theme, setThemeState] = useState<ThemeId>(() => readThemeFromUrl());
  const [system, setSystemState] = useState<SystemId>(() => readSystemFromUrl());
  const [view, setView] = useState<View>('landing');
  const [chart, setChart] = useState<ChartModel | null>(null);
  const [western, setWestern] = useState<WesternModel | null>(null);
  const [partner, setPartner] = useState<ChartModel | null>(null);
  const [checkout, setCheckout] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<ProductId | null>(null);
  /** 궁합 무료 프리뷰(점수 먼저) — 결제 전 단계 */
  const [compatPreview, setCompatPreview] = useState(false);
  /** 프리뷰에서 입력한 상대방 정보 — 결제 모달에 그대로 넘겨 재입력을 없앱니다. */
  const [partnerDraft, setPartnerDraft] = useState<BirthInput | null>(null);
  const [ziweiTier, setZiweiTier] = useState<'none' | 'basic' | 'premium'>('none');
  const [westernPaid, setWesternPaid] = useState(false);
  const [hasBundle, setHasBundle] = useState(false);
  /** 2027 정미년 신년 정밀 리포트 열람 여부 (프로토타입 결제) */
  const [newYearUnlocked, setNewYearUnlocked] = useState(false);
  /** 랜딩의 2027 부적 버튼으로 들어왔을 때 결과 화면에서 부적 섹션으로 이동 */
  const [focusNewYear, setFocusNewYear] = useState(false);
  const [focusAi, setFocusAi] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    const url = new URL(window.location.href);
    url.searchParams.set('theme', next);
    window.history.replaceState({}, '', url);
  }, []);

  const setSystem = useCallback(
    (next: SystemId) => {
      setSystemState(next);
      writeSystemToUrl(next);
      // 결과 화면을 보고 있으면 같은 입력의 다른 체계 결과로 바로 넘어갑니다.
      setView((current) => {
        if (current === 'chart' || current === 'report') return next === 'western' ? 'western' : 'chart';
        if (current === 'western' || current === 'westernReport') return next === 'ziwei' ? 'chart' : 'western';
        return current;
      });
    },
    [],
  );

  useEffect(() => {
    document.title =
      system === 'western'
        ? '서양 점성술 · 출생 천궁도로 읽는 나의 좌표'
        : theme === 'character'
          ? '별의 속삭임 · 별빛 가디언이 읽어주는 나만의 사용설명서'
          : '자미원 紫微垣 · 천문이 알고, 운명이 말하다';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'character' ? '#F7EFFF' : '#090812');
    document.documentElement.style.background = theme === 'character' ? '#F7EFFF' : '#090812';
  }, [theme, system]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  const openChart = async (input: BirthInput) => {
    try {
      // 두 체계는 같은 입력에서 동시에 계산됩니다. 화면은 고른 체계만 보여줍니다.
      const [built, west] = await Promise.all([buildChart(input), buildWestern(input)]);
      setChart(built);
      setWestern(west);
      setView(system === 'western' ? 'western' : 'chart');
      if (pendingProduct) {
        const id = pendingProduct;
        setPendingProduct(null);
        // 궁합은 결제 전에 무료 점수부터 보여 줍니다.
        if (id === 'compat') window.setTimeout(() => setCompatPreview(true), 400);
        else window.setTimeout(() => setCheckout(findProduct(id)), 500);
      }
    } catch (err) {
      flash(err instanceof Error ? err.message : '명반을 계산하지 못했어요. 입력값을 확인해 주세요.');
    }
  };

  const handleProductFromLanding = (id: ProductId) => {
    const product = findProduct(id);
    // 궁합 상품은 결과가 있으면 무료 점수 → 유료 심층 동선으로 안내합니다.
    if (id === 'compat' && chart) {
      setCompatPreview(true);
      return;
    }
    if (id === 'compat' && !chart) {
      setPendingProduct('compat');
      document.getElementById(system === 'western' ? 'western-chart' : 'chart')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      flash(
        theme === 'character'
          ? '먼저 네 별지도를 그리면 궁합 점수를 바로 볼 수 있어!'
          : '먼저 명반을 열면 궁합 점수를 무료로 볼 수 있습니다.',
      );
      return;
    }
    // 서양 점성술 상품은 동양 결과가 없어도 결제 동선이 열립니다.
    const needsChart = product.system !== 'western' || !western;
    if (!needsChart && western) {
      setCheckout(product);
      return;
    }
    setPendingProduct(id);
    if (chart) {
      setCheckout(product);
      setPendingProduct(null);
      return;
    }
    document.getElementById(system === 'western' ? 'western-chart' : 'chart')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    flash(
      theme === 'character'
        ? '먼저 태어난 순간을 알려주면, 바로 이어서 열어줄게!'
        : '먼저 생년월일시를 입력하면 바로 이어서 열어드리겠습니다.',
    );
  };

  const handleUnlock = (id: ProductId) => {
    setFocusAi(false);
    // 2027 신년 리포트는 전용 화면으로 이어집니다 (프로토타입 결제 후 바로 열림).
    if (id === 'newyear2027') {
      if (newYearUnlocked) {
        setCheckout(null);
        setView('newyear2027');
        return;
      }
      setCheckout(findProduct('newyear2027'));
      return;
    }
    // 궁합은 결제창보다 무료 점수 프리뷰를 먼저 엽니다.
    if (id === 'compat') {
      setCheckout(null);
      setCompatPreview(true);
      return;
    }
    if (id === 'western' && westernPaid) {
      setView('westernReport');
      return;
    }
    if ((id === 'premium' || id === 'basic') && ziweiTier !== 'none') {
      setView('report');
      return;
    }
    if (id === 'bundle' && hasBundle) {
      setView('report');
      return;
    }
    setCheckout(findProduct(id));
  };

  /** 무료 결과의 'AI 심층 리포트' 버튼: 결제 후 리포트의 핀셋 해설로 바로 이동 */
  const handleAiReport = () => {
    setFocusAi(true);
    setCheckout(findProduct(theme === 'character' ? 'basic' : 'premium'));
  };

  const handlePaid = async (partnerInput?: BirthInput) => {
    if (!checkout || !chart) return;
    const id = checkout.id;
    setCheckout(null);

    if (id === 'compat') {
      if (!partnerInput) return;
      try {
        setPartner(await buildChart(partnerInput));
        setView('compat');
      } catch {
        flash('상대방 명반을 계산하지 못했어요. 생년월일을 확인해 주세요.');
      }
      return;
    }

    if (id === 'western') {
      setWesternPaid(true);
      setSystemState('western');
      writeSystemToUrl('western');
      setView('westernReport');
      return;
    }

    if (id === 'newyear2027') {
      setNewYearUnlocked(true);
      setView('newyear2027');
      return;
    }

    if (id === 'bundle') {
      setHasBundle(true);
      setWesternPaid(true);
      setZiweiTier('premium');
      setView(system === 'western' ? 'westernReport' : 'report');
      return;
    }

    setZiweiTier(id === 'basic' ? 'basic' : 'premium');
    setView('report');
  };

  /** 랜딩의 2027 신년 부적 배너 — 명반이 없으면 먼저 입력으로 안내합니다. */
  const handleNewYearFromLanding = () => {
    setFocusNewYear(true);
    if (chart) {
      setView('chart');
      return;
    }
    document.getElementById('chart')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    flash(
      theme === 'character'
        ? '먼저 생년월일을 알려주면 2027 부적을 바로 그려줄게!'
        : '먼저 생년월일시를 입력하시면 2027 부적을 그려드립니다.',
    );
  };

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <div className={`theme theme-${theme}`}>
        {view === 'landing' && (
          <Landing
            onSubmit={openChart}
            onSample={() => openChart(SAMPLE_INPUT)}
            onProduct={handleProductFromLanding}
            onNewYear={handleNewYearFromLanding}
            system={system}
            onSystemChange={setSystem}
          />
        )}

        {view === 'chart' && chart && (
          <ChartView
            chart={chart}
            system={system}
            onSystemChange={setSystem}
            newYearUnlocked={newYearUnlocked}
            focusNewYear={focusNewYear}
            onFocusNewYearHandled={() => setFocusNewYear(false)}
            onReset={() => {
              setChart(null);
              setWestern(null);
              setPartner(null);
              setZiweiTier('none');
              setWesternPaid(false);
              setHasBundle(false);
              setNewYearUnlocked(false);
              setView('landing');
            }}
            onUnlock={handleUnlock}
            onAiReport={handleAiReport}
            onCompatPreview={() => {
              setCheckout(null);
              setCompatPreview(true);
            }}
          />
        )}

        {view === 'newyear2027' && chart && (
          <NewYearReport chart={chart} onBack={() => setView('chart')} />
        )}

        {view === 'western' && western && (
          <WesternView
            model={western}
            onSystemChange={setSystem}
            onReset={() => {
              setChart(null);
              setWestern(null);
              setPartner(null);
              setZiweiTier('none');
              setWesternPaid(false);
              setHasBundle(false);
              setView('landing');
            }}
            onUnlock={handleUnlock}
          />
        )}

        {view === 'report' && chart && (
          <PremiumReport
            chart={chart}
            tier={ziweiTier === 'basic' ? 'basic' : 'premium'}
            focusAi={focusAi}
            onBack={() => setView('chart')}
            onCompat={() => handleUnlock('compat')}
            onUpgrade={() => handleUnlock('premium')}
            onBundle={() => handleUnlock('bundle')}
          />
        )}

        {view === 'westernReport' && western && (
          <WesternReport
            model={western}
            hasBundle={hasBundle}
            onBack={() => setView('western')}
            onOpenZiwei={() => setView(chart && ziweiTier !== 'none' ? 'report' : 'chart')}
            onBundle={() => handleUnlock('bundle')}
          />
        )}

        {view === 'compat' && chart && partner && (
          <CompatReport
            chart={chart}
            partner={partner}
            onBack={() => setView('chart')}
            onPremium={() => handleUnlock('premium')}
          />
        )}

        {compatPreview && chart && (
          <CompatPreview
            chart={chart}
            onClose={() => setCompatPreview(false)}
            onUpgrade={(input) => {
              setPartnerDraft(input);
              setCompatPreview(false);
              setCheckout(findProduct('compat'));
            }}
          />
        )}

        {checkout && chart && (
          <CheckoutModal
            product={checkout}
            chartName={chart.name}
            initialPartner={checkout.id === 'compat' ? partnerDraft : null}
            onClose={() => setCheckout(null)}
            onPaid={handlePaid}
            onSelect={(id) => setCheckout(findProduct(id))}
          />
        )}

        {toast && (
          <div
            className="fixed bottom-20 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 animate-rise rounded-full px-5 py-3 text-center text-[11.5px] shadow-lg"
            style={{
              background: 'var(--panel-bg)',
              color: 'var(--panel-text)',
              border: '1px solid var(--panel-line)',
            }}
          >
            {toast}
          </div>
        )}

        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
