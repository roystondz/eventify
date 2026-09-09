import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Check, Plus, Trash2, Calendar, Users, Send, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { api, DEFAULT_PACKAGES, DEFAULT_SERVICES, DEFAULT_ADDONS } from '../../services/api';
import { EVENT_CATEGORIES } from './EventCategories';
import Toast from '../common/Toast';

export default function EventCalculator() {
  const [searchParams] = useSearchParams();
  
  // Data from backend
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('eventType') || 'Weddings & Receptions');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [guestCount, setGuestCount] = useState(150);
  const [eventDate, setEventDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getPackages(), api.getServices(), api.getAddons()]).then(([pkgs, srvs, adds]) => {
      if (isMounted) {
        setPackages(pkgs);
        setServices(srvs);
        setAddons(adds);
        setLoading(false);

        // check URL params
        const pkgIdParam = searchParams.get('packageId');
        if (pkgIdParam) {
          const match = pkgs.find((p) => String(p.id) === String(pkgIdParam));
          if (match) setSelectedPackage(match);
        }

        const srvIdParam = searchParams.get('serviceId');
        if (srvIdParam) {
          const matchSrv = srvs.find((s) => String(s.id) === String(srvIdParam));
          if (matchSrv) setSelectedServices([matchSrv]);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Toggle Services
  const toggleService = (srv) => {
    if (selectedServices.some((s) => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // Toggle Addons
  const toggleAddon = (add) => {
    if (selectedAddons.some((a) => a.id === add.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== add.id));
    } else {
      setSelectedAddons([...selectedAddons, add]);
    }
  };

  // Calculate Totals
  const packageTotal = selectedPackage ? Number(selectedPackage.price) : 0;
  const servicesTotal = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const grandTotal = packageTotal + servicesTotal + addonsTotal;

  // Handle WhatsApp Inquiry
  const handleWhatsApp = () => {
    const text = `Hello Eventify! I would like to inquire about booking an event.%0A%0A` +
      `*Occasion:* ${selectedCategory}%0A` +
      `*Base Package:* ${selectedPackage ? selectedPackage.name + ' (KD' + selectedPackage.price + ')' : 'Custom Build'}%0A` +
      `*Extra Services:* ${selectedServices.map(s => s.name).join(', ') || 'None'}%0A` +
      `*Addons:* ${selectedAddons.map(a => a.name).join(', ') || 'None'}%0A` +
      `*Estimated Guests:* ${guestCount}%0A` +
      `*Date:* ${eventDate || 'TBD'}%0A` +
      `*Total Estimate:* KD${grandTotal.toLocaleString()}%0A%0A` +
      `Name: ${contactName || 'Client'}`;
    
    window.open(`https://wa.me/18005553836?text=${text}`, '_blank');
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToastMessage('Your luxury event proposal request has been received! Our concierge will contact you within 2 hours.');
  };

  return (
    <section className="section" id="builder" style={{ position: 'relative' }}>
      <div className="ambient-glow-top" />

      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={13} />
            <span>INSTANT EVENT BUILDER & PRICING</span>
          </span>
          <h2 className="font-bebas" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em' }}>
            DESIGN YOUR <span className="text-pink-gradient">DREAM EXPERIENCE</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Select your occasion, pick a base bundle or build completely bespoke. Watch your customized quote update in real-time.
          </p>
        </div>

        {/* Builder Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="builder-grid"
        >
          {/* Left: Configuration Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Step 1: Select Occasion */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--button-highlight)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                  }}
                >
                  1
                </span>
                <h3 className="font-bebas" style={{ fontSize: '1.6rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
                  Select Event Occasion
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {EVENT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.title;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.title)}
                      style={{
                        padding: '0.8rem 1rem',
                        background: isSelected ? 'rgba(214, 45, 112, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: isSelected ? '#FFFFFF' : 'var(--main-text)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? '600' : '400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <span>{cat.title}</span>
                      {isSelected && <Check size={16} color="var(--button-highlight)" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Base Package (Optional) */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--gold-accent)',
                      color: '#0A0305',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                    }}
                  >
                    2
                  </span>
                  <h3 className="font-bebas" style={{ fontSize: '1.6rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
                    Choose A Curated Base Bundle (Optional)
                  </h3>
                </div>
                {selectedPackage && (
                  <button
                    onClick={() => setSelectedPackage(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--button-highlight)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Clear Package</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(isSelected ? null : pkg)}
                      style={{
                        padding: '1.25rem',
                        background: isSelected ? 'rgba(188, 58, 107, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isSelected ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className="font-bebas" style={{ fontSize: '1.25rem', color: 'var(--light-champagne)' }}>
                          {pkg.name}
                        </span>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
                            background: isSelected ? 'var(--button-highlight)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFF' }}>
                        KD{Number(pkg.price).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {pkg.savings || 'All-inclusive essentials'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add Individual Services */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--button-highlight)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                  }}
                >
                  3
                </span>
                <h3 className="font-bebas" style={{ fontSize: '1.6rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
                  Add Standalone Services
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {services.map((srv) => {
                  const isSelected = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv)}
                      style={{
                        padding: '1.1rem',
                        background: isSelected ? 'rgba(214, 45, 112, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isSelected ? 'var(--border-pink)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: isSelected ? '#FFFFFF' : 'var(--main-text)' }}>
                          {srv.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--light-champagne)' }}>
                          +KD{Number(srv.price).toLocaleString()}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: `1px solid ${isSelected ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
                          background: isSelected ? 'var(--button-highlight)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? <Check size={14} color="#FFF" strokeWidth={3} /> : <Plus size={14} color="var(--text-muted)" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Add Luxury Addons */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--gold-accent)',
                    color: '#0A0305',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                  }}
                >
                  4
                </span>
                <h3 className="font-bebas" style={{ fontSize: '1.6rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
                  Enhance with Luxury Add-ons & Effects
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {addons.map((add) => {
                  const isSelected = selectedAddons.some((a) => a.id === add.id);
                  return (
                    <div
                      key={add.id}
                      onClick={() => toggleAddon(add)}
                      style={{
                        padding: '1.1rem',
                        background: isSelected ? 'rgba(191, 135, 78, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isSelected ? 'var(--border-gold)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: isSelected ? '#FFFFFF' : 'var(--main-text)' }}>
                          {add.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--light-champagne)' }}>
                          +KD{Number(add.price).toLocaleString()}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: `1px solid ${isSelected ? 'var(--gold-accent)' : 'var(--border-subtle)'}`,
                          background: isSelected ? 'var(--gold-accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? <Check size={14} color="#0A0305" strokeWidth={3} /> : <Plus size={14} color="var(--text-muted)" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Quote Summary & Booking Form */}
          <div
            className="glass-card"
            style={{
              position: 'sticky',
              top: '6.5rem',
              padding: '2rem',
              background: 'linear-gradient(165deg, rgba(35, 12, 24, 0.95) 0%, rgba(15, 4, 10, 0.98) 100%)',
              borderColor: 'var(--border-gold)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-bebas" style={{ fontSize: '1.8rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
                Your Event Estimate
              </h3>
              <span className="badge badge-gold">Live Total</span>
            </div>

            {/* Selected Occasion */}
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Occasion:</span>
              <div style={{ fontWeight: '700', color: 'var(--light-champagne)', fontSize: '1.05rem' }}>
                {selectedCategory}
              </div>
            </div>

            {/* Receipt Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {selectedPackage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--main-text)' }}>
                  <span>{selectedPackage.name}</span>
                  <span style={{ fontWeight: '600' }}>KD{Number(selectedPackage.price).toLocaleString()}</span>
                </div>
              )}

              {selectedServices.map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <span>+ {s.name}</span>
                  <span style={{ color: 'var(--main-text)' }}>KD{Number(s.price).toLocaleString()}</span>
                </div>
              ))}

              {selectedAddons.map((a) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <span>+ {a.name}</span>
                  <span style={{ color: 'var(--main-text)' }}>KD{Number(a.price).toLocaleString()}</span>
                </div>
              ))}

              {!selectedPackage && selectedServices.length === 0 && selectedAddons.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Select a base bundle, services, or addons to see breakdown.
                </p>
              )}
            </div>

            {/* Grand Total */}
            <div
              style={{
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <span className="font-bebas" style={{ fontSize: '1.3rem', color: 'var(--light-champagne)' }}>
                Estimated Total:
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--button-highlight)' }}>KD</span>
                <span className="font-bebas" style={{ fontSize: '2.4rem', color: '#FFFFFF' }}>
                  {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Inquiry / Booking Inputs */}
            {submitted ? (
              <div
                style={{
                  padding: '1.5rem',
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={36} color="#4ADE80" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 className="font-bebas" style={{ fontSize: '1.4rem', color: '#4ADE80', marginBottom: '0.3rem' }}>
                  Inquiry Received!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--main-text)' }}>
                  Thank you, {contactName}! Our luxury event director will contact you promptly to review your customized quote.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Event Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Guest Count</label>
                    <input
                      type="number"
                      className="form-input"
                      value={guestCount}
                      min="10"
                      max="5000"
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    className="form-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    className="form-input"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    className="form-input"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>Request Official Proposal</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="btn btn-gold"
                  style={{ width: '100%' }}
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <style>{`
        @media (max-width: 960px) {
          .builder-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
