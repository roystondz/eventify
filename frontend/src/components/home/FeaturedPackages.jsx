import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Tag, Info } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';

export default function FeaturedPackages({ limit = null }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getPackages().then((data) => {
      if (isMounted) {
        setPackages(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayPackages = limit ? packages.slice(0, limit) : packages;

  const parseItems = (items) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return items.split('\n').filter(Boolean);
      }
    }
    return [];
  };

  return (
    <section className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>ALL-INCLUSIVE EXPERIENCES</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '0.04em' }}>
            CURATED <span className="text-pink-gradient">LUXURY PACKAGES</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Complete, turnkey event production bundles crafted by top industry specialists. Enjoy maximum impact, seamless harmony, and guaranteed savings.
          </p>
        </div>

        {/* Packages Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {displayPackages.map((pkg, idx) => {
            const items = parseItems(pkg.items);
            const isFeatured = idx === 0;

            return (
              <div
                key={pkg.id || idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  borderColor: isFeatured ? 'var(--button-highlight)' : 'var(--border-subtle)',
                  boxShadow: isFeatured ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  position: 'relative',
                  background: isFeatured
                    ? 'linear-gradient(155deg, rgba(42, 14, 28, 0.9) 0%, rgba(18, 6, 12, 0.95) 100%)'
                    : 'var(--gradient-card)',
                }}
              >
                {/* Savings / Popular Ribbon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  {pkg.savings ? (
                    <span className="badge badge-gold">
                      <Tag size={12} />
                      <span>{pkg.savings}</span>
                    </span>
                  ) : (
                    <span className="badge badge-pink">Fully Personalized Suite</span>
                  )}

                  {isFeatured && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        background: 'var(--button-highlight)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3
                  className="font-bebas"
                  style={{
                    fontSize: '1.9rem',
                    letterSpacing: '0.04em',
                    color: 'var(--light-champagne)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {pkg.name}
                </h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.5rem', minHeight: '44px' }}>
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(10, 3, 5, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.75rem',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ fontSize: '1rem', color: 'var(--light-champagne)' }}>KD</span>
                  <span
                    className="font-bebas"
                    style={{
                      fontSize: '2.8rem',
                      lineHeight: '1',
                      color: '#FFFFFF',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {Number(pkg.price).toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: 'auto' }}>
                    Turnkey Package
                  </span>
                </div>

                {/* Package Inclusions List */}
                <div style={{ marginBottom: '2rem', flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: 'var(--light-champagne)',
                      letterSpacing: '0.05em',
                      marginBottom: '0.85rem',
                    }}
                  >
                    What's Included:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {items.slice(0, 5).map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontSize: '0.85rem',
                          color: 'var(--main-text)',
                          lineHeight: '1.4',
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'rgba(214, 45, 112, 0.2)',
                            color: 'var(--button-highlight)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                    {items.length > 5 && (
                      <li style={{ fontSize: '0.8rem', color: 'var(--light-champagne)', paddingLeft: '1.75rem' }}>
                        + {items.length - 5} more luxury inclusions
                      </li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    to={`/calculator?packageId=${pkg.id || idx}`}
                    className={`btn ${isFeatured ? 'btn-primary' : 'btn-gold'}`}
                    style={{ flex: 1 }}
                  >
                    <Sparkles size={16} />
                    <span>Select Package</span>
                  </Link>

                  <button
                    onClick={() => setSelectedPkg(pkg)}
                    className="btn btn-outline"
                    style={{ padding: '0.75rem' }}
                    title="View Package Breakdown"
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Packages Footer link if limited */}
        {limit && packages.length > limit && (
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/packages" className="btn btn-outline btn-lg">
              <span>View All Custom Packages ({packages.length})</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Package Detail Modal */}
      {selectedPkg && (
        <Modal
          isOpen={!!selectedPkg}
          onClose={() => setSelectedPkg(null)}
          title={selectedPkg.name}
          subtitle={`Starting at KD${Number(selectedPkg.price).toLocaleString()} • ${selectedPkg.savings || 'Luxury Turnkey Suite'}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--main-text)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              {selectedPkg.description}
            </p>

            <div>
              <h4 className="font-bebas" style={{ fontSize: '1.3rem', color: 'var(--light-champagne)', marginBottom: '0.75rem' }}>
                Complete Inclusions Checklist:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {parseItems(selectedPkg.items).map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <Check size={16} color="var(--button-highlight)" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link
                to={`/calculator?packageId=${selectedPkg.id}`}
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setSelectedPkg(null)}
              >
                <Sparkles size={18} />
                <span>Customize in Event Builder</span>
              </Link>
              <button onClick={() => setSelectedPkg(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
