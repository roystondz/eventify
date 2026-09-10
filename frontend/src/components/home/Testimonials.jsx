import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Eventify turned our wedding reception into an ethereal wonderland. The custom floral canopy, line-array acoustics, and lighting design were breathtaking beyond words.",
    author: "Lady Catherine & Julian Vance",
    event: "Royal Estate Wedding • 450 Guests",
    rating: 5,
  },
  {
    quote: "The seamless LED curved wall and live video production for our annual tech summit was flawless. Attendees praised the concert-level sound and stage design.",
    author: "Marcus Sterling",
    event: "Executive Brand Gala • 800 Guests",
    rating: 5,
  },
  {
    quote: "From the dry-ice cloud entrance to the Fully Personalized neon lounge, our 30th birthday party was the most talked-about event of the year. Unmatched professionalism.",
    author: "Elena Rostova",
    event: "Private VIP Celebration • 150 Guests",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-dark-elevated)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>CLIENT EXPERIENCES</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '0.04em' }}>
            WORDS FROM OUR <span className="text-gold-gradient">VIP CLIENTS</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--gradient-card)',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={17} color="var(--gold-accent)" fill="var(--gold-accent)" />
                  ))}
                </div>
                <p style={{ color: 'var(--main-text)', fontSize: '0.95rem', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '1.75rem' }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div style={{ fontWeight: '700', color: 'var(--light-champagne)', fontSize: '1.05rem' }}>
                  {t.author}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {t.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
