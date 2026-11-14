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
import WesternView from './components/WesternView';
import WesternReport from './components/WesternReport';
import ThemeToggle from './components/ThemeToggle';

type View = 'landing' | 'chart' | 'report' | 'compat' | 'western' | 'westernReport';

export default function App() {
  const [theme, setThemeState] = useState<ThemeId>(() => readThemeFromUrl());
  const [system, setSystemState] = useState<SystemId>(() => readSystemFromUrl());
  const [view, setView] = useState<View>('landing');
  const [chart, setChart] = useState<ChartModel | null>(null);
  const [western, setWestern] = useState<WesternModel | null>(null);
  const [partner, setPartner] = useState<ChartModel | null>(null);
  const [checkout, setCheckout] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<ProductId | null>(null);
  const [ziweiTier, setZiweiTier] = useState<'none' | 'basic' | 'premium'>('none');
  const [westernPaid, setWesternPaid] = useState(false);
  const [hasBundle, setHasBundle] = useState(false);
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
        const product = findProduct(pendingProduct);
        setPendingProduct(null);
        window.setTimeout(() => setCheckout(product), 500);
      }
    } catch (err) {
      flash(err instanceof Error ? err.message : '명반을 계산하지 못했어요. 입력값을 확인해 주세요.');
    }
  };

  const handleProductFromLanding = (id: ProductId) => {
    const product = findProduct(id);
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

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <div className={`theme theme-${theme}`}>
        {view === 'landing' && (
          <Landing
            onSubmit={openChart}
            onSample={() => openChart(SAMPLE_INPUT)}
            onProduct={handleProductFromLanding}
            system={system}
            onSystemChange={setSystem}
          />
        )}

        {view === 'chart' && chart && (
          <ChartView
            chart={chart}
            system={system}
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
            onAiReport={handleAiReport}
          />
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

        {checkout && chart && (
          <CheckoutModal
            product={checkout}
            chartName={chart.name}
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
