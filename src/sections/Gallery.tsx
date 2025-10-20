'use client';

import { galleryDimensions } from '@/constants/galleryDimensions';
import { useLang, useT } from '@/lib/i18n/LangProvider';
import Image from 'next/image';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

import { MagnifyingGlassPlusIcon } from '@heroicons/react/16/solid';
import 'photoswipe/style.css';
import React, { useEffect, useState } from 'react';

function generateUniqueRandoms(count: number, max: number) {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set);
}

export default function Gallery(): React.ReactElement {
  const [list, setList] = useState<number[] | null>(null);
  const [showList, setShowList] = useState(false);
  const t = useT();
  const { isKr } = useLang();

  useEffect(() => {
    setList(generateUniqueRandoms(27, 30)); // 1~30 중 중복 없이 29개
  }, []);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      showHideAnimationType: 'fade',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();
    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <>
      <section className={`gallery`}>
        <div className='header'>
          <h2 data-aos='fade-up' className={`title ${isKr ? 'kr' : 'en'}`}>
            {t('gallery.title')}
          </h2>
          <p
            data-aos='fade-up'
            className={`sub-title flex items-center gap-1 ${
              isKr ? 'kr' : 'en'
            }`}
          >
            <MagnifyingGlassPlusIcon className='w-4 h-4' />
            {t('gallery.sub_title')}
          </p>
        </div>

        <div
          id='gallery'
          className={`${showList ? 'h-auto' : 'h-[550px]'} overflow-hidden`}
        >
          {list &&
            list.map((p, idx) => (
              <a
                key={idx}
                data-aos='fade-in'
                className='slide aspect-auto'
                href={`/gallery/image${p}.webp`}
                data-pswp-width={galleryDimensions[p]?.width ?? 853}
                data-pswp-height={galleryDimensions[p]?.height ?? 1280}
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  className='thumbnail'
                  src={`/gallery/image${p}.webp`}
                  alt=''
                  width={galleryDimensions[p]?.width ?? 853}
                  height={galleryDimensions[p]?.height ?? 1280}
                />
              </a>
            ))}
        </div>

        <button
          onClick={() => {
            setShowList(!showList);
          }}
          className='!bg-[#e8d8cd] !mt-4 !py-4 !w-full !text-[#806867] m-auto text-center !rounded-2xl'
        >
          {showList ? '접기' : '더보기'}
        </button>
      </section>
      <img
        src='/assets/gallery-bottom-wave.svg'
        className='gallery-bottom-wave'
        alt=''
      />
    </>
  );
}
