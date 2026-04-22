'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatView() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex-shrink-0">
        <h1
          className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
          style={{ color: 'var(--sw-text)' }}
        >
          <MessageCircle size={28} style={{ color: 'var(--sw-accent)' }} />
          WB Chat
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--sw-text-secondary)' }}>
          Chat with the community on Discord
        </p>
      </div>
      {/* Discord Widgetbot iframe */}
      <div className="flex-1 px-4 sm:px-6 pb-4 min-h-0">
        <div
          className="w-full h-full rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--sw-border)', background: '#313338' }}
        >
          <iframe
            src="https://e.widgetbot.io/channels/1487435823283572898/1487698353595617371"
            allow="clipboard-read; clipboard-write"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            title="Discord Chat"
          />
        </div>
      </div>
    </div>
  );
}
