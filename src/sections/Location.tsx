'use client';

import KakaoMap from '@/components/kakao/KakaoMap';
import { KakaoMapSDKProvider } from '@/components/kakao/KakaoMapSDKProvider';
import { useLang, useT } from '@/lib/i18n/LangProvider';
import React from 'react';

const ADDRESS = '인천광역시 계양구 경명대로 1108';
const VENUE = 'CN 웨딩홀 계산 베르테 홀';

export default function Location(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      alert(t('location.address_copied'));
    } catch {}
  };

  return (
    <section className='location'>
      <h2 className={`title kr`}>{t('location.title')}</h2>
      <p className='venue'>{VENUE}</p>
      <button className='copy-address kr' onClick={copyAddress} type='button'>
        <span className='address'>{ADDRESS}</span>
      </button>
      <div className='map'>
        <KakaoMapSDKProvider>
          <KakaoMap
            address={ADDRESS}
            level={3}
            debug
            onLoad={(map) => {
              const c = map.getCenter();
              console.log('[KakaoMap] center lat/lng:', c.getLat(), c.getLng());
            }}
          />
        </KakaoMapSDKProvider>
      </div>
      <img className='location-deco' src='/assets/location-deco.svg' alt='' />
    </section>
  );
}
