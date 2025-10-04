'use client';

import MutedIcon from '@/components/icons/Muted';
import UnMutedIcon from '@/components/icons/UnMuted';
import React, { useRef, useState } from 'react';

export default function Music(): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className='music relative'>
      <div className='music-wrapper'>
        <audio
          ref={audioRef}
          src='/music/music2.mp3'
          autoPlay
          loop
          muted={!isPlaying}
        />
        <button
          onClick={handlePlay}
          aria-label={isPlaying ? 'unmuted' : 'muted'}
        >
          {isPlaying ? (
            <UnMutedIcon color={'var(--color-font-light)'} size={13} />
          ) : (
            <MutedIcon color={'var(--color-font-light)'} size={13} />
          )}
        </button>
      </div>
    </section>
  );
}
