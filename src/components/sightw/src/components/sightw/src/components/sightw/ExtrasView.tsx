'use client';

import React from 'react';
import { ExternalLink, Globe, Terminal, Keyboard, Zap } from 'lucide-react';

const DRAKOZ_SITES = [
  {
    name: 'ZYZlink Lounge',
    url: 'https://sites.google.com/view/ixlmathmr/home',
    desc: 'google site by drakoz',
    icon: Globe,
  },
  {
    name: 'Google Sites',
    url: 'https://sites.google.com',
    desc: 'create your own google site',
    icon: Globe,
  },
];

const EXPLOITS = [
  {
    name: 'Chromebook Shortcuts',
    desc: 'useful keyboard shortcuts for school chromebooks',
    icon: Keyboard,
    isDropdown: true,
    shortcuts: [
      { keys: 'Ctrl + Shift + N', label: 'Incognito window' },
      { keys: 'Ctrl + L', label: 'Focus address bar' },
      { keys: 'Ctrl + Shift + T', label: 'Reopen closed tab' },
      { keys: 'Ctrl + W', label: 'Close current tab' },
      { keys: 'Ctrl + Tab', label: 'Switch tabs' },
      { keys: 'Ctrl + Shift + W', label: 'Close all tabs in window' },
      { keys: 'Alt + Left Arrow', label: 'Go back' },
      { keys: 'Alt + Right Arrow', label: 'Go forward' },
      { keys: 'Ctrl + Shift + Delete', label: 'Clear browsing data' },
      { keys: 'Ctrl + D', label: 'Bookmark current page' },
      { keys: 'Ctrl + Shift + B', label: 'Toggle bookmarks bar' },
      { keys: 'Esc', label: 'Stop loading page' },
    ],
  },
  {
    name: 'Blooket Bot',
    url: 'https://blooketbot.schoolcheats.net/',
    desc: 'automate blooket games — get tokens and answers',
    icon: Zap,
  },
];

export default function ExtrasView() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
          style={{ color: 'var(--sw-text)' }}
        >
          <Terminal size={28} style={{ color: 'var(--sw-accent)' }} />
          Extras
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--sw-text-secondary)' }}>
          other sites, exploits, and useful stuff
        </p>
      </div>

      <div className="space-y-6">
        {/* Other Websites by drakoz */}
        <section className="sw-glass-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ background: 'var(--sw-accent-soft)', color: 'var(--sw-accent)' }}
            >
              <Globe size={18} />
            </div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--sw-text)' }}>
              Other Websites by drakoz
            </h2>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--sw-text-muted)' }}>
            more sites and projects made by drakoz
          </p>
          <div className="space-y-2">
            {DRAKOZ_SITES.map((site) => {
              const Icon = site.icon;
              return (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-colors group"
                  style={{
                    background: 'var(--sw-input-bg)',
                    border: '2px solid var(--sw-input-border)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--sw-accent)'; e.currentTarget.style.background = 'var(--sw-accent-soft)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--sw-input-border)'; e.currentTarget.style.background = 'var(--sw-input-bg)'; }}
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: 'var(--sw-accent-soft)', color: 'var(--sw-accent)' }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--sw-text)' }}>
                      {site.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--sw-text-muted)' }}>
                      {site.desc}
                    </p>
                  </div>
                  <ExternalLink size={14} style={{ color: 'var(--sw-text-muted)' }} />
                </a>
              );
            })}
          </div>
        </section>

        {/* Exploits / Hacks */}
        <section className="sw-glass-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ background: 'var(--sw-accent-soft)', color: 'var(--sw-accent)' }}
            >
              <Terminal size={18} />
            </div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--sw-text)' }}>
              Exploits / Hacks
            </h2>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--sw-text-muted)' }}>
            school chromebook tricks and tools
          </p>
          <div className="space-y-3">
            {EXPLOITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'var(--sw-input-bg)',
                    border: '2px solid var(--sw-input-border)',
                  }}
                >
                  {'url' in item && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sw-accent-soft)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ background: 'var(--sw-accent-soft)', color: 'var(--sw-accent)' }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--sw-text)' }}>
                          {item.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--sw-text-muted)' }}>
                          {item.desc}
                        </p>
                      </div>
                      <ExternalLink size={14} style={{ color: 'var(--sw-text-muted)' }} />
                    </a>
                  ) : (
                    <div className="p-3.5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ background: 'var(--sw-accent-soft)', color: 'var(--sw-accent)' }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--sw-text)' }}>
                            {item.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--sw-text-muted)' }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      {'shortcuts' in item && (
                        <div className="space-y-1.5 ml-11">
                          {item.shortcuts.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs"
                              style={{ background: 'var(--sw-bg-tertiary)' }}
                            >
                              <span style={{ color: 'var(--sw-text-secondary)' }}>{s.label}</span>
                              <kbd
                                className="font-mono text-[10px] px-2 py-0.5 rounded"
                                style={{
                                  background: 'var(--sw-input-bg)',
                                  color: 'var(--sw-accent)',
                                  border: '1px solid var(--sw-input-border)',
                                }}
                              >
                                {s.keys}
                              </kbd>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
