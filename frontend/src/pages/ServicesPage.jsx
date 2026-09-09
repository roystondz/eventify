import React from 'react';
import ServicesGrid from '../components/home/ServicesGrid';
import { Sparkles } from 'lucide-react';

export default function ServicesPage() {
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
          <span className="badge badge-pink" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>SPECIALIZED EXPERTISE</span>
          </span>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '0.04em' }}>
            PRODUCTION <span className="text-gold-gradient">SERVICES & DECOR</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            From high-definition curved LED walls and concert line arrays to architectural floral backdrops and cinema photography, explore our full spectrum of services.
          </p>
        </div>
      </div>

      <ServicesGrid />
    </div>
  );
}
