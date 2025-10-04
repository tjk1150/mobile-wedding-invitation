'use client';

import { EVENT_DATETIME_ISO } from '@/constants/event';
import { useLang, useT } from '@/lib/i18n/LangProvider';
import React, { useEffect, useMemo, useState } from 'react';

function getTimeParts(diffMs: number) {
  const clamped = Math.max(0, diffMs);
  const sec = Math.floor(clamped / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  return { days, hours, minutes, seconds };
}

export default function DDay(): React.ReactElement {
  const { isKr } = useLang();
  const t = useT();
  const target = useMemo(() => new Date(EVENT_DATETIME_ISO).getTime(), []);

  // Start with a stable null value so SSR and the first client render match
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // When now is null, render placeholders by using a zero diff
  const diffMs = target - (now ?? target);
  const { days, hours, minutes, seconds } = getTimeParts(diffMs);
  const hasPassed = now !== null && now >= target;

  const couple = t('event.couple');

  return (
    <section className='dday'>
      <div className='dday-wrap' role='timer' aria-live='polite'>
        <div className='time-box'>
          <span className='num' suppressHydrationWarning>
            {String(days).padStart(2, '0')}
          </span>
          <span className='label en'>DAYS</span>
        </div>
        <span className='colon'>:</span>
        <div className='time-box'>
          <span className='num' suppressHydrationWarning>
            {String(hours).padStart(2, '0')}
          </span>
          <span className='label en'>HOUR</span>
        </div>
        <span className='colon'>:</span>
        <div className='time-box'>
          <span className='num' suppressHydrationWarning>
            {String(minutes).padStart(2, '0')}
          </span>
          <span className='label en'>MIN</span>
        </div>
        <span className='colon'>:</span>
        <div className='time-box'>
          <span className='num' suppressHydrationWarning>
            {String(seconds).padStart(2, '0')}
          </span>
          <span className='label en'>SEC</span>
        </div>
      </div>

      <p className={`dday-note ${isKr ? 'kr' : 'en'}`}>
        {hasPassed
          ? isKr
            ? `${couple}의 결혼식이 시작되었습니다.`
            : `The wedding of ${couple} has begun!`
          : isKr
          ? `${couple}의 결혼식이 ${days}일 남았습니다.`
          : `${days} days until our wedding.`}
      </p>
    </section>
  );
}
