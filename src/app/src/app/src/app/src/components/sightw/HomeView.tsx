'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Gamepad2, ArrowLeft, Maximize2, Minimize2, TrendingUp } from 'lucide-react';

interface PopularGame {
  name: string;
  image: string;
  url: string;
}

const POPULAR_GAMES: PopularGame[] = [
  { name: '1v1lol', image: 'logo.png', url: '1v1lol' },
  { name: '10 Minutes Till Dawn', image: 'splash.png', url: '10-minutes-till-dawn' },
  { name: 'Among Us', image: 'red.png', url: 'among-us' },
  { name: 'Basketball Stars', image: 'assets/images/basketball-stars.png', url: 'basketball-stars' },
];

const CREATION_DATE = new Date('2026-04-15T00:00:00');

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useTimer(): TimeElapsed {
  const [elapsed, setElapsed] = React.useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = now.getTime() - CREATION_DATE.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsed({ days, hours, minutes, seconds });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return elapsed;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-2xl sm:text-3xl font-mono font-bold px-3 py-1.5"
        style={{
          color: 'var(--sw-accent)',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        className="text-[10px] mt-1 uppercase tracking-wider"
        style={{ color: 'var(--sw-text-muted)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function HomeView() {
  const timer = useTimer();
  const [selectedGame, setSelectedGame] = useState<PopularGame | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedGame) {
        setSelectedGame(null);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Game Player View
  if (selectedGame) {
    return (
      <div
        ref={containerRef}
        className="flex flex-col h-full"
        style={{ background: '#000' }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{
            background: 'var(--sw-bg-secondary)',
            borderBottom: '1px solid var(--sw-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedGame(null); setIsFullscreen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                color: 'var(--sw-text)',
                background: 'var(--sw-accent-soft)',
              }}
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="font-semibold text-sm" style={{ color: 'var(--sw-text)' }}>
              {selectedGame.name}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg"
            style={{ color: 'var(--sw-text-secondary)' }}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        <div className="flex-1 relative">
          <iframe
            src={`https://gms.parcoil.com/${selectedGame.url}/`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={selectedGame.name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Hero */}
      <div className="mb-10">
        <div className="text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3"
            style={{ color: 'var(--sw-text)' }}
          >
            sight.w <span style={{ color: 'var(--sw-accent)' }}>v2</span>
          </h1>
          <p
            className="text-base sm:text-lg"
            style={{ color: 'var(--sw-text-secondary)' }}
          >
            ur spot for stuff
          </p>
        </div>
      </div>

      {/* Popular Games */}
      <div className="mb-8">
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--sw-text-muted)' }}
        >
          <TrendingUp size={14} />
          popular games
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_GAMES.map((game) => (
            <button
              key={game.url}
              onClick={() => setSelectedGame(game)}
              className="sw-glass-card overflow-hidden game-card text-left p-0 group"
            >
              <div
                className="relative w-full aspect-square overflow-hidden"
                style={{ background: 'var(--sw-bg-tertiary)' }}
              >
                {!imageErrors.has(game.url) ? (
                  <img
                    src={`https://gms.parcoil.com/${game.url}/${game.image}`}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => {
                      setImageErrors((prev) => new Set(prev).add(game.url));
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 size={32} style={{ color: 'var(--sw-text-muted)' }} />
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: 'var(--sw-accent)',
                      color: 'var(--sw-bg)',
                    }}
                  >
                    Play Now
                  </div>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: 'var(--sw-text)' }}
                >
                  {game.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Timer */}
      <div
        className="p-5 sm:p-6 mb-8 rounded-xl"
        style={{
          background: 'var(--sw-glass-bg)',
          border: '1px solid var(--sw-glass-border)',
        }}
      >
        <div className="text-center mb-3">
          <p
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: 'var(--sw-accent)' }}
          >
            time since launch
          </p>
        </div>
        <div className="flex justify-center gap-3 sm:gap-5">
          <TimeBlock value={timer.days} label="Days" />
          <TimeBlock value={timer.hours} label="Hrs" />
          <TimeBlock value={timer.minutes} label="Min" />
          <TimeBlock value={timer.seconds} label="Sec" />
        </div>
      </div>

      {/* Developers Section - no icons */}
      <div className="mb-8">
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: 'var(--sw-text-muted)' }}
        >
          the devs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'var(--sw-glass-bg)',
              border: '1px solid var(--sw-glass-border)',
            }}
          >
            <p className="font-bold text-sm" style={{ color: 'var(--sw-text)' }}>
              drakoz
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--sw-accent)' }}>
              lead dev
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--sw-text-secondary)' }}>
              did most of the work
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'var(--sw-glass-bg)',
              border: '1px solid var(--sw-glass-border)',
            }}
          >
            <p className="font-bold text-sm" style={{ color: 'var(--sw-text)' }}>
              okliterally
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--sw-accent)' }}>
              co-dev
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--sw-text-secondary)' }}>
              helped build this thing too, was a former owner
            </p>
          </div>
        </div>
      </div>

      {/* Proxy Status */}
      <div
        className="p-4 rounded-xl mb-8"
        style={{
          background: 'var(--sw-glass-bg)',
          border: '1px solid var(--sw-glass-border)',
        }}
      >
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-2"
          style={{ color: 'var(--sw-text-muted)' }}
        >
          proxy status
        </h2>
        <p className="text-xs" style={{ color: 'var(--sw-text-secondary)' }}>
          working on the proxy rn, never used one before so bear with me
        </p>
      </div>

      {/* Latest Updates - only FINALLY RELEASED */}
      <div>
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: 'var(--sw-text-muted)' }}
        >
          latest updates
        </h2>
        <div className="space-y-2">
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'var(--sw-glass-bg)',
              border: '1px solid var(--sw-glass-border)',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-1.5 rounded-md flex-shrink-0"
                style={{ color: 'var(--sw-accent)', background: 'var(--sw-accent-soft)' }}
              >
                <Sparkles size={14} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--sw-text)' }}>
                  FINALLY RELEASED
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--sw-text-secondary)' }}>
                  sight.w v2 is out. full rebuild, 293 games, chat, themes, custom cursors, and more.
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--sw-text-muted)' }}>
                  Apr 15, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
