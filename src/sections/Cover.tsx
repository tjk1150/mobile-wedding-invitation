'use client';

import { useLang, useT } from '@/lib/i18n/LangProvider';
import React, { useEffect, useState } from 'react';

const MAX_SECTION_HEIGHT = 900;

export default function Cover(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();
  const [sectionHeight, setSectionHeight] =
    useState<number>(MAX_SECTION_HEIGHT);

  useEffect(() => {
    const compute = () => {
      const h =
        typeof window !== 'undefined' ? window.innerHeight : MAX_SECTION_HEIGHT;
      setSectionHeight(Math.min(h, MAX_SECTION_HEIGHT));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <section
      className='cover'
      style={{
        height: `${sectionHeight}px`,
        backgroundImage: "url('/assets/cover.webp')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      {/* decor layer (no external lib) */}
      <div className='confetti-area' aria-hidden='true' />

      <div className='names-kr-box'>
        <span className='names kr'>장진태</span>
        <span className='names kr'>그리고</span>
        <span className='names kr'>김조은</span>
      </div>

      <div className='cover-title-container'>
        <div className='names-en-box'>
          <span className='names en-sacramento'>JinTae & JoEun</span>
        </div>

        <div className='event-date-and-place-box'>
          <span className={`event-date-and-time ${isKr ? 'kr' : 'en'}`}>
            {t('cover.date')}
          </span>
          <span className={`event-place ${isKr ? 'kr' : 'en'}`}>
            {t('cover.place')}
          </span>
        </div>
      </div>
    </section>
  );
}
