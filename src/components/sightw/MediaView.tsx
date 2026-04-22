'use client';

import React from 'react';
import { Film } from 'lucide-react';

export default function MediaView() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex-shrink-0">
        <h1
          className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
          style={{ color: 'var(--sw-text)' }}
        >
          <Film size={28} style={{ color: 'var(--sw-accent)' }} />
          Media
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--sw-text-secondary)' }}>
          Watch movies and shows
        </p>
      </div>
      {/* iframe */}
      <div className="flex-1 px-4 sm:px-6 pb-4">
        <div
          className="w-full h-full rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--sw-border)' }}
        >
          <iframe
            src="https://www.fmovies.gd/home"
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title="Media Player"
          />
        </div>
      </div>
    </div>
  );
}
