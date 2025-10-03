'use client';

import { useLang, useT } from '@/lib/i18n/LangProvider';
import React from 'react';

const ADDRESS = '인천광역시 계양구 경명대로 1108';
const VENUE = 'CN 웨딩홀 계산 베르테 홀';

export default function Location(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    ADDRESS
  )}`;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      alert(t('location.address_copied'));
    } catch {}
  };

  return (
    <>
      <img
        src='/assets/location-top-wave.svg'
        className='location-top-wave'
        alt=''
      />
      <section className='location'>
        <h2 className={`title ${isKr ? 'kr' : 'en'}`}>{t('location.title')}</h2>
        <p className='venue en'>{VENUE}</p>
        <button className='copy-address en' onClick={copyAddress} type='button'>
          <span className='address'>{ADDRESS}</span>
        </button>
        <div className='map'>
          <iframe
            className='google-maps'
            title='google maps'
            allowFullScreen
            referrerPolicy='no-referrer-when-downgrade'
            src={googleMapsUrl}
          />
        </div>
        <img className='location-deco' src='/assets/location-deco.svg' alt='' />
      </section>
    </>
  );
}
