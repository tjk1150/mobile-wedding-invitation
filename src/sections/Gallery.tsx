'use client';

import { useLang, useT } from '@/lib/i18n/LangProvider';
import Image from 'next/image';
import React from 'react';

type Photo = { src: string; width: number; height: number };

const photos: Photo[] = [
  { src: '/assets/gallery/10.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/2.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/3.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/4.webp', width: 2000, height: 1333 },
  { src: '/assets/gallery/5.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/6.webp', width: 2000, height: 1333 },
  { src: '/assets/gallery/7.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/8.webp', width: 1200, height: 1800 },
  { src: '/assets/gallery/9.webp', width: 1200, height: 1790 },
  { src: '/assets/gallery/11.webp', width: 1200, height: 1790 },
];

export default function Gallery(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();

  return (
    <section className='gallery'>
      <div className='header'>
        <h2 className={`title ${isKr ? 'kr' : 'en'}`}>{t('gallery.title')}</h2>
        <p className={`sub-title ${isKr ? 'kr' : 'en'}`}>
          {t('gallery.sub_title')}
        </p>
      </div>

      <div id='gallery'>
        {photos.map((p, idx) => (
          <a
            key={p.src + idx}
            className='slide'
            href={p.src}
            target='_blank'
            rel='noreferrer'
          >
            <Image
              className='thumbnail'
              src={p.src}
              alt=''
              width={p.width}
              height={p.height}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
