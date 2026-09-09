import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const EVENT_CATEGORIES = [
  {
    id: 'weddings',
    title: 'Weddings & Receptions',
    desc: 'Fairytale royal entrances, grand floral mandaps & canopies, ambient romantic lighting.',
    image: '/assets/events/weddings.png',
  },
  {
    id: 'engagements',
    title: 'Engagements & Proposals',
    desc: 'Intimate candlelit soirées, bespoke floral arches, and cinematic milestone moments.',
    image: '/assets/events/engagemnets.png',
  },
  {
    id: 'anniversaries',
    title: 'Anniversary Galas',
    desc: 'Timeless luxury milestone celebrations with premium staging and acoustic elegance.',
    image: '/assets/events/anniversaries.png',
  },
  {
    id: 'birthdays',
    title: 'Milestone Birthdays',
    desc: 'High-energy themed decor, neon installations, club sound & lighting productions.',
    image: '/assets/events/birthdays.png',
  },
  {
    id: 'private-dinners',
    title: 'VIP Private Dinners',
    desc: 'Exclusive culinary atmospheres, gold tableware styling, and soft ambient pin-spotting.',
    image: '/assets/events/private dinners.png',
  },
  {
    id: 'private-parties',
    title: 'Exclusive Private Parties',
    desc: 'Bespoke DJ entertainment, interactive LED screens, and custom cocktail atmospheres.',
    image: '/assets/events/private parties.png',
  },
  {
    id: 'baby-showers',
    title: 'Luxury Baby Showers',
    desc: 'Dreamy pastel floral backdrops, dessert table styling, and welcoming entrances.',
    image: '/assets/events/baby showers.png',
  },
  {
    id: 'graduation-parties',
    title: 'Graduation Banquets',
    desc: 'Sophisticated celebration staging, pro photo backdrops, and memorable entertainment.',
    image: '/assets/events/graduation parties.png',
  },
  {
    id: 'farewell-parties',
    title: 'Farewell Soirées',
    desc: 'Heartfelt, elegant ambiance with personalized photo walls and acoustic audio.',
    image: '/assets/events/farewell parties.png',
  },
  {
    id: 'family-celebrations',
    title: 'Family Celebrations',
    desc: 'Multi-generational joyful gatherings with tailored dining setups and live music.',
    image: '/assets/events/family celebrations.png',
  },
  {
    id: 'custom-themed',
    title: 'Custom Themed Productions',
    desc: 'Immersive fantasy worlds, Gatsby galas, tropical retreats, and bespoke art sets.',
    image: '/assets/events/custom themed.png',
  },
];

export default function EventCategories() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-dark-elevated)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-pink" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>TAILORED CELEBRATIONS</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '0.04em' }}>
            SIGNATURE <span className="text-gold-gradient">EVENT OCCASIONS</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Whether you envision a grand 500-guest wedding or an intimate rooftop dinner, our visionary designers craft every element to perfection.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {EVENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/calculator?eventType=${encodeURIComponent(cat.title)}`}
              className="glass-card"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '340px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {/* Background Image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("${cat.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 0,
                }}
                className="category-bg-image"
              />

              {/* Gradient Scrim */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(10,3,5,0.1) 0%, rgba(10,3,5,0.65) 50%, rgba(10,3,5,0.95) 100%)',
                  zIndex: 1,
                }}
              />

              {/* Card Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginTop: 'auto',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3
                    className="font-bebas"
                    style={{
                      fontSize: '1.55rem',
                      letterSpacing: '0.04em',
                      color: 'var(--light-champagne)',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {cat.title}
                  </h3>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(214, 45, 112, 0.25)',
                      border: '1px solid var(--border-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <p style={{ color: 'var(--main-text)', opacity: 0.85, fontSize: '0.84rem', lineHeight: '1.5' }}>
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .glass-card:hover .category-bg-image {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
