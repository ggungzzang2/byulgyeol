import { useEffect, useState } from 'react';
import type { BirthInput, Gender } from '../lib/chart';
import type { Product } from '../lib/products';
import { productPoints, productPrice, productScopeNote, productTagline } from '../lib/products';
import { useTheme } from '../lib/theme';
import { LockIcon } from './ui';

type Props = {
  product: Product;
  chartName: string;
  onClose: () => void;
  onPaid: (partner?: BirthInput) => void;
};

const YEARS = Array.from({ length: 2015 - 1930 + 1 }, (_, i) => 2015 - i);

export default function CheckoutModal({ product, chartName, onClose, onPaid }: Props) {
  const { theme, copy } = useTheme();
  const isCharacter = theme === 'character';
  const [agree, setAgree] = useState(false);
  const [stage, setStage] = useState<'form' | 'processing' | 'done'>('form');
  const [method, setMethod] = useState<'card' | 'kakao' | 'naver'>('card');

  const [pName, setPName] = useState('');
  const [pYear, setPYear] = useState('');
  const [pMonth, setPMonth] = useState('');
  const [pDay, setPDay] = useState('');
  const [pTime, setPTime] = useState('6');
  const [pGender, setPGender] = useState<Gender>('male');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const pay = () => {
    if (!agree) {
      setError(isCharacter ? '동의 체크를 먼저 눌러줘!' : '결제 진행에 동의해 주세요.');
      return;
    }
    if (product.id === 'compat' && (!pYear || !pMonth || !pDay)) {
      setError(isCharacter ? '상대방의 태어난 날도 알려줘!' : '상대방의 생년월일을 입력해 주세요.');
      return;
    }
    setError(null);
    setStage('processing');
    window.setTimeout(() => {
      setStage('done');
      window.setTimeout(() => {
        onPaid(
          product.id === 'compat'
            ? {
                name: pName,
                year: Number(pYear),
                month: Number(pMonth),
                day: Number(pDay),
                calendar: 'solar',
                isLeap: false,
                timeIndex: Number(pTime),
                timeKnown: true,
                gender: pGender,
              }
            : undefined,
        );
      }, 650);
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="결제 확인"
        className="t-card animate-rise max-h-[92vh] w-full max-w-[460px] overflow-y-auto !rounded-b-none sm:!rounded-b-[26px]"
        style={{ background: 'var(--card-2)' }}
      >
        <div className="flex items-start justify-between gap-3 px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="min-w-0">
            <p className="eyebrow">{copy.checkout.eyebrow}</p>
            <h3 className="t-title mt-1.5 text-[18px] leading-snug">{product.name}</h3>
            <p className="mt-0.5 text-[11.5px] t-muted">{productTagline(product, theme)}</p>
            {isCharacter && product.id === 'basic' && (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px]" style={{ background: 'rgba(255,214,190,0.5)', color: '#a8648a' }}>
                ☕ 커피 한 잔 값
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1 -mt-1 rounded-full p-2 transition t-muted"
            style={{ background: 'var(--field-bg)' }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-2 rounded-2xl p-4 text-[12px]" style={{ background: 'var(--field-bg)' }}>
            <div className="flex justify-between gap-3 t-muted">
              <span>{copy.checkout.order}</span>
              <span className="truncate t-body">{chartName || '익명'}</span>
            </div>
            <div className="flex justify-between gap-3 t-muted">
              <span>상품</span>
              <span className="truncate t-body">{product.name}</span>
            </div>
            <div className="flex justify-between gap-3 t-muted">
              <span>{copy.checkout.period}</span>
              <span className="t-body">{copy.checkout.periodValue}</span>
            </div>
            <div className="my-1 h-px" style={{ background: 'var(--line)' }} />
            <div className="flex items-end justify-between">
              <span className="t-muted">{copy.checkout.amount}</span>
              <span className="text-[17px] font-bold t-title">
                {productPrice(product, theme).toLocaleString('ko-KR')}
                <span className="ml-0.5 text-[11px] font-normal t-muted">원</span>
              </span>
            </div>
          </div>

          {productScopeNote(product, theme) && (
            <div className="mt-3 rounded-2xl p-4" style={{ border: '1px dashed var(--line-strong)' }}>
              <p className="text-[10.5px] font-semibold tracking-[0.06em] t-muted">
                {isCharacter ? '이 이야기에 담기는 것' : '이 리포트에 담기는 것'}
              </p>
              <ul className="mt-2 space-y-1 text-[11.5px] leading-[1.75] t-body">
                {productPoints(product, theme).map((pt) => (
                  <li key={pt} className="flex gap-1.5">
                    <span style={{ color: 'var(--accent)' }}>·</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 pt-2.5 text-[10.5px] leading-[1.75] t-faint" style={{ borderTop: '1px solid var(--line)' }}>
                {productScopeNote(product, theme)}
              </p>
            </div>
          )}

          {product.id === 'compat' && (
            <div className="mt-4 rounded-2xl p-4" style={{ border: '1px solid var(--line)' }}>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.08em] t-muted">{copy.checkout.partner}</p>
              <input
                className="t-field mb-2 !text-[13px]"
                placeholder="이름 (선택)"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                <select className="t-field num !text-[13px]" value={pYear} onChange={(e) => setPYear(e.target.value)}>
                  <option value="">YYYY</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select className="t-field num !text-[13px]" value={pMonth} onChange={(e) => setPMonth(e.target.value)}>
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
                <select className="t-field num !text-[13px]" value={pDay} onChange={(e) => setPDay(e.target.value)}>
                  <option value="">DD</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}일
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select className="t-field !text-[13px]" value={pTime} onChange={(e) => setPTime(e.target.value)}>
                  <option value="6">시간 모름 (정오)</option>
                  <option value="0">자시 00–01</option>
                  <option value="2">인시 03–05</option>
                  <option value="4">진시 07–09</option>
                  <option value="6">오시 11–13</option>
                  <option value="8">신시 15–17</option>
                  <option value="10">술시 19–21</option>
                </select>
                <select className="t-field !text-[13px]" value={pGender} onChange={(e) => setPGender(e.target.value as Gender)}>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] t-muted">{copy.checkout.method}</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: '카드' },
                { id: 'kakao', label: '카카오페이' },
                { id: 'naver', label: '네이버페이' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as typeof method)}
                  className="rounded-xl px-2 py-2.5 text-[11.5px] font-medium transition"
                  style={
                    method === m.id
                      ? { background: 'var(--accent-soft)', border: '1px solid var(--line-strong)', color: 'var(--accent-deep)' }
                      : { background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)' }
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2 text-[11px] leading-[1.7] t-muted">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
            <span>{copy.checkout.agree}</span>
          </label>

          {error && <p className="mt-2 text-[11.5px]" style={{ color: isCharacter ? '#d97d9a' : '#d98a7a' }}>{error}</p>}

          <div className="mt-4 rounded-xl px-3 py-2.5 text-[10.5px] leading-[1.7]" style={{ background: 'var(--accent-soft)', border: '1px dashed var(--line-strong)', color: 'var(--accent-deep)' }}>
            {copy.checkout.note}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4" style={{ borderTop: '1px solid var(--line)', background: 'var(--card-2)' }}>
          <button onClick={pay} disabled={stage !== 'form'} className="t-btn t-btn-primary w-full py-3.5">
            {stage === 'form' && (
              <>
                <LockIcon className="h-3.5 w-3.5" />
                {copy.checkout.pay(productPrice(product, theme).toLocaleString('ko-KR'))}
              </>
            )}
            {stage === 'processing' && (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
                {copy.checkout.processing}
              </span>
            )}
            {stage === 'done' && (
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
                {copy.checkout.done}
              </span>
            )}
          </button>
          <button onClick={onClose} className="mt-2 w-full text-center text-[11.5px] t-faint">
            {copy.checkout.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
