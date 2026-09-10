import React from 'react';
import GalleryShowcase from '../components/home/GalleryShowcase';
import { Sparkles } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: '5rem' }}>
      <div
        style={{
          padding: '4rem 0 2rem 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="ambient-glow-top" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>VISUAL INSPIRATION</span>
          </span>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '0.04em' }}>
            OUR EVENT <span className="text-pink-gradient">GALLERY</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            A curated visual showcase of our fully personalized setups, staging, floral architecture, atmospheric lighting, and high-energy celebrations.
          </p>
        </div>
      </div>

      <GalleryShowcase isFullPage={true} />
    </div>
  );
}
