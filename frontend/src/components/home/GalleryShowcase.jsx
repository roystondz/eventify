import React, { useState } from 'react';
import { Sparkles, Maximize2, X, Eye } from 'lucide-react';
import Modal from '../common/Modal';

const GALLERY_ITEMS = [
  { id: 1, title: 'Grand Royal Stage & Chandelier Canopy', category: 'Weddings', img: '/assets/banners/1.png' },
  { id: 2, title: 'Intimate Candlelit Dining Experience', category: 'Private Dinners', img: '/assets/banners/2.png' },
  { id: 3, title: 'Neon Themed DJ Stage & Club Lighting', category: 'Parties', img: '/assets/banners/3.png' },
  { id: 4, title: 'Bespoke Floral Arch & Gold Staging', category: 'Weddings', img: '/assets/banners/4.png' },
  { id: 5, title: 'Architectural Uplighting & Banquet Setup', category: 'Galas', img: '/assets/banners/5.png' },
  { id: 6, title: 'Ultra-Wide Curved LED Screen Production', category: 'Corporate', img: '/assets/banners/6.png' },
  { id: 7, title: 'Fairytale Entrance Tunnel & Cold Sparks', category: 'Weddings', img: '/assets/banners/7.png' },
  { id: 8, title: 'High-Fashion VIP Milestone Reception', category: 'Anniversaries', img: '/assets/banners/8.png' },
  { id: 9, title: 'Immersive Laser & Sound Stage', category: 'Parties', img: '/assets/banners/9.png' },
  { id: 10, title: 'Grand Ballroom Floral Centerpiece Walkway', category: 'Galas', img: '/assets/banners/10.png' },
];

export default function GalleryShowcase({ isFullPage = false }) {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Weddings', 'Galas', 'Parties', 'Private Dinners', 'Corporate'];

  const filteredItems = filter === 'All'
    ? (isFullPage ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, 6))
    : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>VISUAL PORTFOLIO</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '0.04em' }}>
            OUR <span className="text-pink-gradient">MASTERPIECE PRODUCTIONS</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Immerse yourself in our portfolio of spellbinding atmospheres, bespoke floral architectural works, and concert-grade stages.
          </p>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '2rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${filter === cat ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
                  background: filter === cat ? 'var(--gradient-pink)' : 'rgba(255, 255, 255, 0.03)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="glass-card"
              style={{
                height: '300px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="gallery-zoom"
              />
              
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(10,3,5,0.92) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                }}
              >
                <span className="badge badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '0.4rem', fontSize: '0.72rem' }}>
                  {item.category}
                </span>
                <h4
                  className="font-bebas"
                  style={{
                    fontSize: '1.4rem',
                    letterSpacing: '0.03em',
                    color: 'var(--light-champagne)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{item.title}</span>
                  <Eye size={18} color="var(--button-highlight)" />
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title={selectedImage.title}
          subtitle={`Category: ${selectedImage.category}`}
          maxWidth="900px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '65vh', background: '#000' }}>
              <img
                src={selectedImage.img}
                alt={selectedImage.title}
                style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', margin: '0 auto' }}
              />
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .glass-card:hover .gallery-zoom {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
