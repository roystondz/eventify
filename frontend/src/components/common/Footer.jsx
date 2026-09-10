import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Sparkles, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#070204',
        borderTop: '1px solid var(--border-subtle)',
        padding: '5rem 0 2rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="ambient-glow-top" style={{ top: 'auto', bottom: 0, opacity: 0.5 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <img
                src="/assets/brand/logo-full.png"
                alt="Eventify"
                style={{ height: '42px', width: 'auto' }}
              />
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Elevate Every Moment. We architect Fully Personalized, luxury experiential events, breathtaking stages, cutting-edge audiovisuals, and unforgettable memories.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--light-champagne)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bebas" style={{ fontSize: '1.25rem', letterSpacing: '0.08em', color: 'var(--light-champagne)', marginBottom: '1.25rem' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Curated Packages', path: '/packages' },
                { label: 'Event Services', path: '/services' },
                { label: 'Custom Event Builder', path: '/calculator' },
                { label: 'Photo & Video Gallery', path: '/gallery' },
                { label: 'Contact Us & Booking', path: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--button-highlight)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="font-bebas" style={{ fontSize: '1.25rem', letterSpacing: '0.08em', color: 'var(--light-champagne)', marginBottom: '1.25rem' }}>
              Signature Occasions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li>Royal Weddings & Receptions</li>
              <li>Milestone Birthdays & Anniversaries</li>
              <li>VIP Private Dinners & Galas</li>
              <li>Luxury Engagements & Baby Showers</li>
              <li>Themed Corporate Productions</li>
            </ul>
          </div>

          {/* Contact Concierge */}
          <div>
            <h4 className="font-bebas" style={{ fontSize: '1.25rem', letterSpacing: '0.08em', color: 'var(--light-champagne)', marginBottom: '1.25rem' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--gold-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Kuwait</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--gold-accent)" style={{ flexShrink: 0 }} />
                <span>WhatsApp / Contact: +965 6643 3680</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--gold-accent)" style={{ flexShrink: 0 }} />
                <span>concierge@eventify.com</span>
              </div>
              <Link to="/calculator" className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                <Sparkles size={14} />
                <span>Get Instant Quote</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(223, 182, 138, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Eventify Experiences Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="var(--button-highlight)" fill="var(--button-highlight)" />
            <span>for Extraordinary Events</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
