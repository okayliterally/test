'use client';

import React, { useState } from 'react';
import { Handshake, Plus, Globe, X } from 'lucide-react';

export default function PartnersView() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
          style={{ color: 'var(--sw-text)' }}
        >
          <Handshake size={28} style={{ color: 'var(--sw-accent)' }} />
          Partners
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--sw-text-secondary)' }}>
          Our amazing partners and collaborators
        </p>
      </div>

      {/* Partner Form CTA */}
      <div
        className="sw-glass-card p-6 sm:p-8 text-center mb-8"
        style={{
          background: 'var(--sw-accent-soft)',
          border: '1px solid var(--sw-glass-border)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'var(--sw-accent)',
            color: 'var(--sw-bg)',
          }}
        >
          <Plus size={28} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--sw-text)' }}
        >
          Want to Partner With Us?
        </h2>
        <p
          className="text-sm mb-5 max-w-md mx-auto"
          style={{ color: 'var(--sw-text-secondary)' }}
        >
          Have a cool site or project? We&apos;d love to collaborate! Reach out and let&apos;s make something great together.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: 'var(--sw-accent)',
            color: 'var(--sw-bg)',
          }}
        >
          <Globe size={16} />
          Apply Now
        </button>
      </div>

      {/* Partner Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="rounded-xl overflow-hidden max-w-2xl w-full"
            style={{
              background: 'var(--sw-bg-secondary)',
              border: '2px solid var(--sw-glass-border)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--sw-border)' }}
            >
              <div className="flex items-center gap-2">
                <Handshake size={18} style={{ color: 'var(--sw-accent)' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--sw-text)' }}>
                  Partner Application
                </span>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg"
                style={{ color: 'var(--sw-text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>
            {/* iframe */}
            <div className="flex-1 min-h-0">
              <iframe
                src="https://mathsight.fillout.com/sightw"
                style={{
                  width: '100%',
                  height: '70vh',
                  border: 'none',
                }}
                title="Partner Application Form"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
