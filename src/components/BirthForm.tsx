import { useMemo, useState } from 'react';
import type { BirthInput, Gender } from '../lib/chart';
import { TIME_OPTIONS } from '../lib/terms';
import { THEME_ART, useTheme } from '../lib/theme';
import { StarMark } from './ui';

type Props = {
  onSubmit: (input: BirthInput) => void;
  onSample: () => void;
  variant?: 'hero' | 'inline';
};

const YEARS = Array.from({ length: 2015 - 1930 + 1 }, (_, i) => 2015 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();

export default function BirthForm({ onSubmit, onSample, variant = 'hero' }: Props) {
  const { theme, copy } = useTheme();
  const isCharacter = theme === 'character';
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [calendar, setCalendar] = useState<'solar' | 'lunar'>('solar');
  const [isLeap, setIsLeap] = useState(false);
  const [timeIndex, setTimeIndex] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    const y = Number(year) || 2000;
    const m = Number(month) || 1;
    const max = calendar === 'lunar' ? 30 : daysIn(y, m);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month, calendar]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !month || !day) {
      setError(isCharacter ? '태어난 날을 먼저 알려줘!' : '생년월일을 선택해 주세요.');
      return;
    }
    setError(null);
    const timeKnown = timeIndex !== 'unknown' && timeIndex !== '';
    onSubmit({
      name,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      calendar,
      isLeap: calendar === 'lunar' ? isLeap : false,
      timeIndex: timeKnown ? Number(timeIndex) : 6,
      timeKnown,
      gender,
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`${variant === 'hero' ? 't-card p-6 sm:p-8' : 't-card p-6 sm:p-7'} relative overflow-hidden`}
    >
      {isCharacter && (
        <>
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-60 blur-2xl"
            style={{ background: 'radial-gradient(closest-side,#e9d9ff,#ffe3d1 70%,transparent)' }}
          />
          <div className="pointer-events-none absolute right-5 top-4 flex items-center gap-1 text-[10px] text-[#b09ccc]">
            <span>✦</span>
            <span>✧</span>
          </div>
        </>
      )}

      <div className="relative mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{copy.form.eyebrow}</p>
          <h2 className="t-title mt-2 text-[21px] leading-snug sm:text-[23px]">
            {copy.form.title}
            {isCharacter && <span className="ml-1 align-middle text-[15px] text-[#c7a7f0]">✧</span>}
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed t-muted">{copy.form.desc}</p>
        </div>
        {isCharacter ? (
          <span className="guardian-avatar mt-1 hidden h-11 w-11 shrink-0 sm:block">
            <img src={THEME_ART.character.hero} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span
            className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex"
            style={{ border: '1px solid var(--line-strong)', color: 'var(--accent)' }}
          >
            <StarMark className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="relative space-y-4">
        <div>
          <label className="t-field-label" htmlFor="name">
            {isCharacter ? '별지도에 새길 이름' : '이름'} <span className="opacity-60">(선택)</span>
          </label>
          <input
            id="name"
            className="t-field"
            placeholder={copy.form.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
          />
        </div>

        <div>
          <span className="t-field-label">{isCharacter ? '태어난 날' : '생년월일'}</span>
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2">
            <select aria-label="년" className="t-field num" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">YYYY</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            <select
              aria-label="월"
              className="t-field num"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setDay('');
              }}
            >
              <option value="">MM</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <select aria-label="일" className="t-field num" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">DD</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <span className="t-field-label">{isCharacter ? '달력' : '양력 / 음력'}</span>
            <div className="t-seg">
              <button
                type="button"
                className={calendar === 'solar' ? 'is-active' : ''}
                onClick={() => setCalendar('solar')}
              >
                {copy.form.solar}
              </button>
              <button
                type="button"
                className={calendar === 'lunar' ? 'is-active' : ''}
                onClick={() => setCalendar('lunar')}
              >
                {copy.form.lunar}
              </button>
            </div>
          </div>
          <div>
            <span className="t-field-label">{isCharacter ? '성별' : '성별'}</span>
            <div className="t-seg">
              <button
                type="button"
                className={gender === 'female' ? 'is-active' : ''}
                onClick={() => setGender('female')}
              >
                {copy.form.female}
              </button>
              <button
                type="button"
                className={gender === 'male' ? 'is-active' : ''}
                onClick={() => setGender('male')}
              >
                {copy.form.male}
              </button>
            </div>
          </div>
        </div>

        {calendar === 'lunar' && (
          <label className="flex cursor-pointer items-center gap-2 text-[12px] t-muted">
            <input
              type="checkbox"
              checked={isLeap}
              onChange={(e) => setIsLeap(e.target.checked)}
              className="h-4 w-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
            윤달입니다
          </label>
        )}

        <div>
          <label className="t-field-label" htmlFor="time">
            {isCharacter ? '별이 뜬 시간' : '태어난 시간'} <span className="opacity-60">(12시진)</span>
          </label>
          <select id="time" className="t-field" value={timeIndex} onChange={(e) => setTimeIndex(e.target.value)}>
            <option value="">{isCharacter ? '몇 시쯤 태어났는지 알려줘' : '시진을 선택해 주세요'}</option>
            {TIME_OPTIONS.map((t) => (
              <option key={t.index} value={t.index}>
                {t.label} · {t.range}
              </option>
            ))}
            <option value="unknown">{isCharacter ? '시간 모름 (정오 기준)' : '시간 모름 (정오 기준으로 계산)'}</option>
          </select>
          <p className="mt-2 text-[11px] leading-relaxed t-faint">{copy.form.timeHint}</p>
        </div>
      </div>

      {error && <p className="relative mt-4 text-[12px] text-[#d98a7a]">{error}</p>}

      <button type="submit" className="t-btn t-btn-primary relative mt-6 w-full py-3.5 text-[14px]">
        {copy.form.submit}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 12h13M13 6.5L18.5 12 13 17.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onSample}
        className="relative mt-3 w-full text-center text-[12px] underline decoration-1 underline-offset-4 transition t-muted"
        style={{ textDecorationColor: 'var(--line-strong)' }}
      >
        {copy.form.sample}
      </button>
    </form>
  );
}
