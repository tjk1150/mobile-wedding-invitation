'use client';
import Account from '@/sections/Account';
import Calendar from '@/sections/Calendar';
import Cover from '@/sections/Cover';
import DDay from '@/sections/DDay';
import Gallery from '@/sections/Gallery';
import Letter from '@/sections/Letter';
import Location from '@/sections/Location';
import Music from '@/sections/Music';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    AOS.init({ startEvent: 'DOMContentLoaded', delay: 200, duration: 800 });

    AOS.refresh();
  }, []);
  return (
    <div
      className='min-h-screen flex flex-col items-stretch'
      style={{ display: 'contents' }}
    >
      <Music />
      <Cover />
      <Letter />
      <Calendar />
      <DDay />
      <Gallery />
      <Account />
      <Location />
    </div>
  );
}
