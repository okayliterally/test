'use client';

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import Sidebar from '@/components/sightw/Sidebar';
import Header from '@/components/sightw/Header';
import HomeView from '@/components/sightw/HomeView';
import ActivitiesView from '@/components/sightw/ActivitiesView';
import PartnersView from '@/components/sightw/PartnersView';
import MediaView from '@/components/sightw/MediaView';
import ChatView from '@/components/sightw/ChatView';
import ExtrasView from '@/components/sightw/ExtrasView';
import SettingsView, { type SiteSettings } from '@/components/sightw/SettingsView';
import ParticlesBackground from '@/components/sightw/ParticlesBackground';
import CrosshairOverlay from '@/components/sightw/CrosshairOverlay';
import CursorTrail from '@/components/sightw/CursorTrail';

type Page = 'home' | 'activities' | 'partners' | 'media' | 'chat' | 'extras' | 'settings';

const DEFAULT_SETTINGS: SiteSettings = {
  theme: 'dark',
  navLayout: 'sidebar',
  disableAnimations: false,
  fpsBooster: false,
  disableParticles: false,
  particleStyle: 'balls',
  particleDensity: 80,
  particleSpeed: 3,
  tabCloak: null,
  panicKey: '`',
  crosshairEnabled: false,
  crosshairType: 'cross',
  crosshairColor: '#00ff88',
  crosshairSize: 20,
  crosshairThickness: 2,
  crosshairOpacity: 1,
  crosshairGap: 4,
  crosshairDot: false,
  cursorTrailEnabled: false,
  cursorTrailColor: '#8b5cf6',
  cursorTrailLength: 20,
  cursorTrailWidth: 2,
  cursorTrailStyle: 'dots',
};

function getSettingsFromStorage(): SiteSettings {
  try {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem('sightw-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettingsToStorage(settings: SiteSettings) {
  try {
    localStorage.setItem('sightw-settings', JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// Simple external store for settings to avoid setState-in-effect
let currentSettings: SiteSettings = DEFAULT_SETTINGS;
const settingsListeners = new Set<() => void>();

function emitSettingsChange() {
  settingsListeners.forEach((l) => l());
}

function useSettingsStore() {
  return useSyncExternalStore(
    (callback) => {
      settingsListeners.add(callback);
      return () => settingsListeners.delete(callback);
    },
    () => currentSettings,
    () => DEFAULT_SETTINGS
  );
}

function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
      style={{ background: '#0a0a0f' }}
    >
      <div className="loading-logo mb-8">
        <img
          src="https://image2url.com/r2/default/images/1772114193046-733bfa71-77a7-4fdc-bce4-d3e8ebe17a29.png"
          alt="sight.w"
          className="w-24 h-24 rounded-2xl object-contain"
        />
      </div>
      <div
        className="w-48 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full loading-bar"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #c084fc, #8b5cf6)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      <p className="loading-text mt-4 text-xs font-medium tracking-widest uppercase" style={{ color: '#8b5cf6' }}>
        Loading sight.w
      </p>
    </div>
  );
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showAboutSite, setShowAboutSite] = useState(false);
  const mountedRef = useRef(false);
  const settings = useSettingsStore();

  const setSettings = useCallback((newSettings: SiteSettings) => {
    currentSettings = newSettings;
    saveSettingsToStorage(newSettings);
    emitSettingsChange();
  }, []);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    currentSettings = getSettingsFromStorage();
    emitSettingsChange();
    mountedRef.current = true;
    // Show welcome popup on first visit
    const welcomed = localStorage.getItem('sightw-welcomed');
    if (!welcomed) {
      setTimeout(() => setShowWelcome(true), 2000);
    }
    return () => { mountedRef.current = false; };
  }, []);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mountedRef.current) return;
    if (settings.theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // Apply animation classes
  useEffect(() => {
    if (!mountedRef.current) return;
    const root = document.documentElement;
    if (settings.disableAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
    if (settings.fpsBooster) {
      root.classList.add('fps-booster');
    } else {
      root.classList.remove('fps-booster');
    }
    return () => {
      root.classList.remove('no-animations', 'fps-booster');
    };
  }, [settings.disableAnimations, settings.fpsBooster]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide system cursor when crosshair is enabled
  useEffect(() => {
    if (!mountedRef.current) return;
    if (settings.crosshairEnabled) {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
    } else {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, [settings.crosshairEnabled]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('sightw-welcomed', 'true');
  };

  // Custom right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };
    const handleClick = () => setContextMenu(null);
    const handleScroll = () => setContextMenu(null);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'activities':
        return <ActivitiesView />;
      case 'partners':
        return <PartnersView />;
      case 'media':
        return <MediaView />;
      case 'chat':
        return <ChatView />;
      case 'extras':
        return <ExtrasView />;
      case 'settings':
        return <SettingsView settings={settings} setSettings={setSettings} />;
      default:
        return <HomeView />;
    }
  };

  // Get accent color for particles based on theme
  const getParticleColor = () => {
    const themeColors: Record<string, string> = {
      dark: '#ffffff',
      light: '#7c3aed',
      ocean: '#06b6d4',
      forest: '#22c55e',
      earthy: '#8b7355',
      neon: '#00ff88',
      sunset: '#f472b6',
      cyan: '#22d3ee',
      grey: '#5865f2',
    };
    return themeColors[settings.theme] || '#ffffff';
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{
        background: 'var(--sw-bg)',
        color: 'var(--sw-text)',
      }}
    >
      {/* Particles Background */}
      {!settings.disableParticles && settings.particleStyle !== 'none' && (
        <ParticlesBackground
          color={getParticleColor()}
          count={settings.particleDensity}
          speed={settings.particleSpeed}
          style={settings.particleStyle}
        />
      )}

      {/* Crosshair Overlay */}
      <CrosshairOverlay
        enabled={settings.crosshairEnabled}
        type={settings.crosshairType}
        color={settings.crosshairColor}
        size={settings.crosshairSize}
        thickness={settings.crosshairThickness}
        opacity={settings.crosshairOpacity}
        gap={settings.crosshairGap}
        dot={settings.crosshairDot}
      />

      {/* Cursor Trail */}
      <CursorTrail
        enabled={settings.cursorTrailEnabled}
        color={settings.cursorTrailColor}
        length={settings.cursorTrailLength}
        width={settings.cursorTrailWidth}
        style={settings.cursorTrailStyle as 'line' | 'dots' | 'sparkle'}
      />

      {/* Navigation: Sidebar or Header */}
      {settings.navLayout === 'sidebar' ? (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onShowCredits={() => setShowCredits(true)}
        />
      ) : null}

      {/* Welcome Popup */}
      {showWelcome && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={dismissWelcome}
        >
          <div
            className="rounded-xl p-6 max-w-sm w-full"
            style={{ background: 'var(--sw-bg-secondary)', border: '1px solid var(--sw-glass-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--sw-text)' }}>
              welcome to sight.w v2
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--sw-text-secondary)' }}>
              sight.w original was in beta. this is the full updated version.
            </p>
            <p className="text-xs mb-5" style={{ color: 'var(--sw-text-muted)' }}>
              working on the proxy, never used one before so it might take a bit.
            </p>
            <button
              onClick={dismissWelcome}
              className="w-full py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--sw-accent)', color: 'var(--sw-bg)' }}
            >
              got it
            </button>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[10000] rounded-xl py-1.5 min-w-[200px]"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 220),
            top: Math.min(contextMenu.y, window.innerHeight - 160),
            background: 'var(--sw-bg-secondary)',
            border: '2px solid var(--sw-glass-border)',
            boxShadow: 'var(--sw-shadow)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { setShowAbout(true); setContextMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--sw-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sw-accent-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            About
          </button>
          <button
            onClick={() => { setCurrentPage('settings'); setContextMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--sw-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sw-accent-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Settings
          </button>
          <div style={{ height: '1px', background: 'var(--sw-border)', margin: '2px 8px' }} />
          <button
            onClick={() => { setShowAboutSite(true); setContextMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--sw-accent)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sw-accent-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            About the Site
          </button>
        </div>
      )}

      {/* About Website Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowAbout(false)}
        >
          <div
            className="rounded-xl p-6 sm:p-8 max-w-md w-full"
            style={{ background: 'var(--sw-bg-secondary)', border: '2px solid var(--sw-glass-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--sw-text)' }}>
              About sight.w
            </h2>
            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--sw-text-secondary)' }}>
                sight.w (also known as mathixl) is a student-built web portal made for having fun at school. It started as a small beta project and has grown into a full platform with hundreds of games, a built-in chat, custom themes, and more features being added all the time.
              </p>
              <div style={{ height: '1px', background: 'var(--sw-border)' }} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--sw-accent)' }}>
                  Developers
                </p>
                <p className="text-sm" style={{ color: 'var(--sw-text)' }}>
                  <strong>drakoz</strong> — lead dev, did most of the work
                </p>
                <p className="text-sm" style={{ color: 'var(--sw-text)' }}>
                  <strong>okliterally</strong> — co-dev, helped build this thing too, was a former owner
                </p>
              </div>
              <div style={{ height: '1px', background: 'var(--sw-border)' }} />
              <p className="text-xs" style={{ color: 'var(--sw-text-muted)' }}>
                version 2.0 — launched april 2026
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--sw-accent)', color: 'var(--sw-bg)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* About the Site Modal (Unblocked Gaming) */}
      {showAboutSite && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowAboutSite(false)}
        >
          <div
            className="rounded-xl p-6 sm:p-8 max-w-md w-full"
            style={{ background: 'var(--sw-bg-secondary)', border: '2px solid var(--sw-glass-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--sw-text)' }}>
              sight.w is unblocked gaming
            </h2>
            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--sw-text-secondary)' }}>
                sight.w is an unblocked gaming website made for students who want to play games at school without dealing with blocked sites. We host hundreds of games that work on school networks through a proxy system.
              </p>
              <p className="text-sm" style={{ color: 'var(--sw-text-secondary)' }}>
                The site also includes features like tab cloaking (disguise the tab as Google Classroom or Docs), a panic key to instantly switch to a school-safe page, and an about:blank cloak that hides your browsing history completely.
              </p>
              <p className="text-sm" style={{ color: 'var(--sw-text-secondary)' }}>
                We are currently working on improving the proxy so more games load faster and more reliably. If games are slow, check back soon — updates are always being pushed.
              </p>
              <div style={{ height: '1px', background: 'var(--sw-border)' }} />
              <p className="text-xs" style={{ color: 'var(--sw-text-muted)' }}>
                made by students, for students
              </p>
            </div>
            <button
              onClick={() => setShowAboutSite(false)}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--sw-accent)', color: 'var(--sw-bg)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowCredits(false)}
        >
          <div
            className="sw-glass-card p-6 sm:p-8 max-w-md w-full"
            style={{ background: 'var(--sw-bg-secondary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--sw-text)' }}
            >
              Credits
            </h2>
            <div className="space-y-4" style={{ color: 'var(--sw-text-secondary)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--sw-accent)' }}>Developers</p>
                <p className="text-sm mt-1">
                  <strong style={{ color: 'var(--sw-text)' }}>drakoz</strong> — Lead Developer, did most of the work
                </p>
                <p className="text-sm">
                  <strong style={{ color: 'var(--sw-text)' }}>okliterally</strong> — Co-Dev, helped build this thing too, was a former owner
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--sw-accent)' }}>About</p>
                <p className="text-sm mt-1">
                  sight.w (mathixl) — A student game and activities portal built for fun and learning.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--sw-accent)' }}>Special Thanks</p>
                <p className="text-sm mt-1">
                  Everyone who uses the site and spreads the word!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCredits(false)}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--sw-accent)', color: 'var(--sw-bg)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className="flex-1 h-full overflow-hidden flex flex-col"
      >
        {/* Header nav when selected */}
        {settings.navLayout === 'header' && (
          <Header
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onShowCredits={() => setShowCredits(true)}
          />
        )}

        {/* Mobile top padding for fixed sidebar header */}
        {settings.navLayout === 'sidebar' && (
          <div className="md:hidden h-16 flex-shrink-0" style={{ background: 'var(--sw-bg)' }} />
        )}

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden sw-scrollbar page-enter"
          key={currentPage}
        >
          {renderView()}
        </div>
      </main>
    </div>
  );
}
