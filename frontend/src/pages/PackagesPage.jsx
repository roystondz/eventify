import React from 'react';
import FeaturedPackages from '../components/home/FeaturedPackages';
import { Sparkles } from 'lucide-react';

export default function PackagesPage() {
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
            <span>VIP EXPERIENCE PACKAGES</span>
          </span>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '0.04em' }}>
            COMPLETE <span className="text-pink-gradient">EVENT PACKAGES</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Discover our meticulously curated event production bundles. Each package combines award-winning decor, state-of-the-art audiovisuals, and seamless coordination.
          </p>
        </div>
      </div>

      <FeaturedPackages />
    </div>
  );
}
