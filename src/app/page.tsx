'use client';
import Account from '@/sections/Account';
import Calendar from '@/sections/Calendar';
import Cover from '@/sections/Cover';
import DDay from '@/sections/DDay';
import Gallery from '@/sections/Gallery';
import Letter from '@/sections/Letter';
import Location from '@/sections/Location';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  useEffect(() => {
    AOS.init({ startEvent: 'DOMContentLoaded', delay: 300, duration: 1000 });

    AOS.refresh();
  }, []);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
    setPlaying(true);
  };

  return (
    <div
      className='min-h-screen flex flex-col items-stretch'
      style={{ display: 'contents' }}
    >
      <div className='music-wrapper'>
        <audio ref={audioRef} src='/music/music2.mp3' autoPlay loop />
        {!playing && <button onClick={handlePlay}>음악</button>}
      </div>

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
