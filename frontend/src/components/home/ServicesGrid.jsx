import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, Check, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function ServicesGrid({ limit = null }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getServices().then((data) => {
      if (isMounted) {
        setServices(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayServices = limit ? services.slice(0, limit) : services;

  // Map service item to corresponding image
  const getServiceImage = (service) => {
    if (service.image) return service.image;
    const name = (service.name || '').toLowerCase();
    if (name.includes('sound') || name.includes('dj')) return '/assets/services/dj and sound system.png';
    if (name.includes('light')) return '/assets/services/event lighting.png';
    if (name.includes('backdrop') || name.includes('stage')) return '/assets/services/decor and backdrop.png';
    if (name.includes('decor') || name.includes('theme')) return '/assets/services/custom theme decor.png';
    if (name.includes('host') || name.includes('mc')) return '/assets/services/host_mc.png';
    if (name.includes('led') || name.includes('screen') || name.includes('display')) return '/assets/services/led display.png';
    if (name.includes('photo')) return '/assets/services/photography.png';
    if (name.includes('video') || name.includes('film')) return '/assets/services/videography.png';
    return '/assets/services/custom theme decor.png';
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-dark-elevated)', position: 'relative' }}>
      <div className="ambient-glow-gold" style={{ top: '20%', right: '-150px' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-pink" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>FULL-SERVICE CAPABILITIES</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '0.04em' }}>
            INDIVIDUAL <span className="text-gold-gradient">EXPERIENCE SERVICES</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Need specific standalone expertise? Explore our comprehensive production services designed to elevate any celebration.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {displayServices.map((service, idx) => {
            const imgUrl = getServiceImage(service);

            return (
              <div
                key={service.id || idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--gradient-card)',
                }}
              >
                {/* Image Header */}
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={imgUrl}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    className="service-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,3,5,0.85) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      className="badge badge-gold"
                      style={{ fontSize: '0.75rem', backdropFilter: 'blur(8px)', background: 'rgba(10,3,5,0.7)' }}
                    >
                      From KD{Number(service.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3
                    className="font-bebas"
                    style={{
                      fontSize: '1.45rem',
                      letterSpacing: '0.03em',
                      color: 'var(--light-champagne)',
                    }}
                  >
                    {service.name}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', flex: 1 }}>
                    {service.description}
                  </p>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <Link
                      to={`/calculator?serviceId=${service.id}`}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Plus size={15} />
                      <span>Add to Event Quote</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {limit && services.length > limit && (
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-outline btn-lg">
              <span>View All Services ({services.length})</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .glass-card:hover .service-img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
