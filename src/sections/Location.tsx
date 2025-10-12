'use client';

import KakaoMap from '@/components/kakao/KakaoMap';
import { KakaoMapSDKProvider } from '@/components/kakao/KakaoMapSDKProvider';
import { useT } from '@/lib/i18n/LangProvider';
import { MapPinIcon } from '@heroicons/react/16/solid';
import React from 'react';

const ADDRESS = '인천광역시 계양구 경명대로 1108';
const VENUE = 'CN 웨딩홀 계산점 2층 베르테 홀';

export default function Location(): React.ReactElement {
  const t = useT();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      alert(t('location.address_copied'));
    } catch {}
  };

  const locationData = [
    {
      icon: 'subway',
      title: '지하철',
      description: ['인천지하철: 계산역 1번 출구 도보 5분'],
    },
    {
      icon: 'bus',
      title: '버스',
      description: [
        '간선버스',
        '24-1, 30, 79, 80',
        '마을버스',
        '584-1, 588',
        '일반버스',
        '81, 88',
        '광역버스',
        '1500, 9500',
        '좌석버스',
        '111, 111B, 302',
        '시외버스',
        '3000, 3030, 5000',
      ],
    },
    {
      icon: 'car',
      title: '자가용',
      description: [
        "네비게이션 'CN웨딩홀 계산점'을 검색",
        '인천광역시 계양구 경명대로 1108',
      ],
    },
    {
      icon: 'parking',
      title: '주차',
      description: [
        'CN웨딩홀 계산점 주차타워 3개층',
        '(동시주차 600대, 하객 2시간 무료)',
        '',
        '전용주차장이 다소 혼잡할 수 있으니',
        '가급적 대중교통 이용 부탁드립니다.',
      ],
    },
  ];

  const getIcon = (iconType: string) => {
    const iconPath = `/assets/location/${iconType}.svg`;

    return (
      <div className='icon-circle'>
        <img
          src={iconPath}
          alt={iconType}
          className='w-full h-full object-contain'
        />
      </div>
    );
  };

  return (
    <section className='location'>
      <hgroup className='kr'>
        <h2 className={`title kr`}>{t('location.title')}</h2>
        <p className='venue kr'>{VENUE}</p>
      </hgroup>
      <button className='copy-address kr' onClick={copyAddress} type='button'>
        <MapPinIcon className='w-4 h-4' />
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
      <div className='kr rounded-2xl w-full waytocome-wrap'>
        <ul>
          {locationData.map((item, index) => {
            return (
              <li
                key={index}
                className={`flex gap-4 py-6 ${
                  index < locationData.length - 1
                    ? 'border-b border-[#D0C0B5]'
                    : ''
                }`}
                data-aos='fade-up'
              >
                <div className='flex-shrink-0'>{getIcon(item.icon)}</div>
                <div className='flex-1'>
                  <hgroup className='text-md font-bold mb-2 text-[#5A4A3A]'>
                    {item.title}
                  </hgroup>
                  {item.description && item.description.length > 0 && (
                    <div className='leading-relaxed text-[#6B5B4B] text-sm'>
                      {item.description.map((line, idx) => {
                        return <div key={idx}>{line || '\u00A0'}</div>;
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <img className='location-deco' src='/assets/location-deco.svg' alt='' />
    </section>
  );
}
