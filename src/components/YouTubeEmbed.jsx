'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';

// Click-to-load YouTube: only a local thumbnail until the visitor presses play, so no
// third-party scripts or cookies load with the page (youtube-nocookie once playing).
export function YouTubeEmbed({ id, title, thumb, sizes }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className="group/yt absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
      <Image src={thumb} alt="" fill sizes={sizes} className="object-cover" />
      <span className="absolute inset-0 bg-black/30 transition-colors group-hover/yt:bg-black/10" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent-strong text-white shadow-2xl transition-transform group-hover/yt:scale-110"
      >
        <Play size={26} className="ml-1" fill="currentColor" />
      </span>
    </button>
  );
}
