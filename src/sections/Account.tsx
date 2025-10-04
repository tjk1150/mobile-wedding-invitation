'use client';

import { useLang, useT } from '@/lib/i18n/LangProvider';
import React, { useState } from 'react';

function copyToClipboard(text: string) {
  const plain = text.replace(/[^0-9]/g, '');
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(plain);
  }
  return new Promise<void>((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = plain;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      resolve();
    } catch (e) {
      reject(e as Error);
    }
  });
}

type Entry = {
  bank: string;
  number: string;
  name: string;
};

type GroupProps = {
  id: string;
  title: string;
  entries: Entry[];
};

function AccountGroup({ id, title, entries }: GroupProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <div className='account-group'>
      <button
        id={`account-${id}-header`}
        className={`account-toggle ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-controls={`account-${id}-panel`}
        onClick={toggle}
        type='button'
      >
        <span className='kr' style={{ fontWeight: 600 }}>
          {title}
        </span>
        <svg
          className='chevron'
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden
        >
          <path
            d='M6 9l6 6 6-6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {open && (
        <ul
          id={`account-${id}-panel`}
          role='region'
          aria-labelledby={`account-${id}-header`}
          className='account-panel'
        >
          {entries.map((e, idx) => (
            <li key={idx} className='account-item'>
              <div>
                <span className='account-bank kr'>{e.bank} | </span>
                <span className='account-number kr'>{e.number}</span>
              </div>
              <button
                className='account-copy'
                onClick={async (ev) => {
                  ev.stopPropagation();
                  try {
                    await copyToClipboard(e.number);
                    alert(t('account.copied'));
                  } catch {}
                }}
                aria-label={`계좌번호 복사: ${e.bank} ${e.number}`}
                type='button'
              >
                <span className='kr'>{t('account.copy')}</span>
              </button>
              <div className='account-name kr'>{e.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Account(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();

  const groomList: Entry[] = [
    { bank: '기업', number: '123-456-000000', name: '장진태' },
    { bank: '우리', number: '123-456-000000', name: '장진철' },
    { bank: '국민', number: '123-456-000000', name: '이해열' },
  ];
  const brideList: Entry[] = [
    { bank: '농협', number: '123-456-000000', name: '김조은' },
    { bank: '하나', number: '123-456-000000', name: '김원태' },
    { bank: '농협', number: '123-456-000000', name: '박한업' },
  ];

  return (
    <section className='account'>
      <div className='header'>
        <img className='header-deco' src='/assets/letter-deco.svg' alt='' />
        <h2 className={`title ${isKr ? 'kr' : 'en'}`}>{t('account.title')}</h2>
      </div>

      <AccountGroup
        id='groom'
        title={t('account.groom.title')}
        entries={groomList}
      />
      <AccountGroup
        id='bride'
        title={t('account.bride.title')}
        entries={brideList}
      />
    </section>
  );
}
