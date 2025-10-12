'use client';

import { useLang, useT } from '@/lib/i18n/LangProvider';
import React from 'react';

export default function Letter(): React.ReactElement {
  const t = useT();
  const { isKr, isEn } = useLang();

  return (
    <>
      <section className='letter'>
        <div className='header'>
          <img
            data-aos='fade-up'
            className='header-deco '
            src='/assets/letter-deco.svg'
            alt='letter header deco'
          />
          {/* <h2 className={`title ${isKr ? "kr" : "en"}`}>{t("letter.date")}</h2> */}
          <p data-aos='fade-up' className={`sub-title ${isKr ? 'kr' : 'en'}`}>
            {t('letter.sub_title')}
          </p>
        </div>

        <div className='letter-container'>
          <p
            data-aos='fade-up'
            style={{
              whiteSpace: 'pre-line',
            }}
            className={`letter ${isKr ? 'kr' : 'en'}`}
          >
            {t('letter.letter_content')}
          </p>

          {isEn ? (
            <div className='letter-signature'>
              <p className='en'>with love</p>
              <p className='en'>JinTae & JoEun</p>
            </div>
          ) : (
            <div className='family-description kr'>
              <p data-aos='fade-up'>
                장진철
                <span className='name-divider' aria-hidden>
                  <svg
                    width='3'
                    height='3'
                    viewBox='0 0 3 3'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#B99493' />
                  </svg>
                </span>
                이해열 <span className='son'>의 차남</span>장진태
              </p>
              <p data-aos='fade-up'>
                김원태
                <span className='name-divider' aria-hidden>
                  <svg
                    width='3'
                    height='3'
                    viewBox='0 0 3 3'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='1.5' cy='1.5' r='1.5' fill='#B99493' />
                  </svg>
                </span>
                박한업<span className='daughter'>의 차녀</span>김조은
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
