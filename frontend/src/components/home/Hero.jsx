import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award, Calendar } from 'lucide-react';

const HERO_IMAGES = [
  '/assets/banners/main.png',
  '/assets/banners/1.png',
  '/assets/banners/2.png',
  '/assets/banners/3.png',
  '/assets/banners/6.png',
];

export default function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Image Carousel with Overlay Gradients */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={img}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${img}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === currentIdx ? 0.38 : 0,
            transition: 'opacity 1.8s ease-in-out, transform 8s ease-out',
            transform: idx === currentIdx ? 'scale(1.05)' : 'scale(1)',
            zIndex: 0,
          }}
        />
      ))}

      {/* Multi-layer Gradient Vignettes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10, 3, 5, 0.75) 0%, rgba(10, 3, 5, 0.4) 40%, rgba(10, 3, 5, 0.95) 90%, #0A0305 100%)',
          zIndex: 1,
        }}
      />
      <div className="ambient-glow-top" />

      {/* Hero Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1050px' }}>
        
        {/* Top Floating Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span
            className="badge badge-gold animate-fade-in"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem', gap: '0.5rem' }}
          >
            <Sparkles size={14} color="var(--light-champagne)" />
            <span>FULLY PERSONALIZED LUXURY EVENT ARCHITECTS</span>
            <Sparkles size={14} color="var(--light-champagne)" />
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="font-bebas"
          style={{
            fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
            lineHeight: '0.95',
            letterSpacing: '0.04em',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}
        >
          ELEVATE EVERY MOMENT. <br />
          <span className="text-pink-gradient">WE CREATE EXPERIENCES.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--main-text)',
            opacity: 0.9,
            maxWidth: '780px',
            margin: '0 auto 2.75rem auto',
            lineHeight: '1.7',
            fontWeight: 300,
          }}
        >
          From grand fairytale weddings and high-profile corporate galas to exclusive VIP parties, we blend breathtaking floral decor, concert-grade sound, intelligent lighting, and seamless production.
        </p>

        {/* Action CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '4.5rem',
          }}
        >
          <Link to="/calculator" className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
            <Sparkles size={20} />
            <span>Build Your Event</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/packages" className="btn btn-outline btn-lg" style={{ minWidth: '200px' }}>
            <span>Explore Packages</span>
          </Link>
        </div>

        {/* Bottom Trust Stat Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {[
            { icon: Award, label: '200+ Events', sub: 'Flawlessly Executed' },
            { icon: Star, label: '5-Star Rated', sub: 'Celebrity & VIP Choice' },
            { icon: ShieldCheck, label: 'Fully Personalized', sub: 'Tailored to You' },
            { icon: Calendar, label: 'Full Production', sub: 'Decor, Sound & Lighting' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.4rem',
                background: 'rgba(25, 9, 18, 0.45)',
              }}
            >
              <stat.icon size={22} color="var(--gold-accent)" />
              <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--light-champagne)' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
