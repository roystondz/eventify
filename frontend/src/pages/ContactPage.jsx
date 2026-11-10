import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import Toast from '../components/common/Toast';
import { EVENT_CATEGORIES } from '../components/home/EventCategories';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import { openWhatsApp } from '../lib/whatsapp';

export default function ContactPage() {
  const settings = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState(EVENT_CATEGORIES[0].title);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitInquiry({
        source: 'contact',
        name,
        email,
        phone,
        event_type: eventType,
        message,
      });
      setSubmitted(true);
      setToast({ message: 'Thank you! Your message has been sent.', type: 'success' });
    } catch (err) {
      setToast({
        message: `Could not send your message: ${err.message} You can also reach us on WhatsApp.`,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    openWhatsApp(settings.whatsapp_number, [
      `Hello Eventify! I would like to ask about a ${eventType}.`,
      '',
      `Name: ${name || 'Client'}`,
      email ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      message ? `Details: ${message}` : null,
    ]);
  };

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
            <span>VIP CONCIERGE</span>
          </span>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '0.04em' }}>
            CONNECT WITH <span className="text-pink-gradient">OUR DIRECTORS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Ready to bring your dream event to life? Connect with our dedicated event planning team for personalized consultation and venue scouting.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2.25rem' }}>
              <h3 className="font-bebas" style={{ fontSize: '1.8rem', color: 'var(--light-champagne)', marginBottom: '1.5rem' }}>
                Eventify Headquarters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(191, 135, 78, 0.15)', color: 'var(--gold-accent)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--main-text)' }}>Address</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {settings.address}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(214, 45, 112, 0.15)', color: 'var(--button-highlight)' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--main-text)' }}>Direct Phone</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} style={{ color: 'inherit' }}>
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {settings.email && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(191, 135, 78, 0.15)', color: 'var(--gold-accent)' }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--main-text)' }}>Email Inquiries</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        <a href={`mailto:${settings.email}`} style={{ color: 'inherit' }}>{settings.email}</a>
                      </div>
                    </div>
                  </div>
                )}

                {/* <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(214, 45, 112, 0.15)', color: 'var(--button-highlight)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--main-text)' }}>Working Hours</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Sun – Thursay: 8:00 AM – 4:00 PM<br />
                      Sunday: By Private VIP Appointment
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Quick Action */}
            <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(188, 58, 107, 0.15)', borderColor: 'var(--border-pink)' }}>
              <h4 className="font-bebas" style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Need Fast Booking Assistance?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--main-text)', opacity: 0.9, marginBottom: '1.25rem' }}>
                Chat instantly with our lead event producers on WhatsApp for immediate availability and date hold.
              </p>
              <button onClick={handleWhatsApp} className="btn btn-gold btn-sm" style={{ width: '100%' }}>
                <MessageSquare size={16} />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--gradient-card)' }}>
            <h3 className="font-bebas" style={{ fontSize: '2rem', color: 'var(--light-champagne)', marginBottom: '0.5rem' }}>
              Send A Message
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Fill in your event details below and our lead director will prepare a tailored conceptual proposal for you.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={48} color="#4ADE80" style={{ margin: '0 auto 1rem auto' }} />
                <h4 className="font-bebas" style={{ fontSize: '1.8rem', color: '#4ADE80', marginBottom: '0.5rem' }}>
                  Thank You, {name}!
                </h4>
                <p style={{ color: 'var(--main-text)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  Your message has reached our team. We will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      autoComplete="tel"
                      placeholder="+965 0000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Occasion Type</label>
                  <select
                    className="form-select"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Event Vision & Special Requests</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Tell us about your estimated guest count, preferred venue, aesthetic theme, or required services..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.75rem' }} disabled={submitting}>
                  <Send size={18} />
                  <span>{submitting ? 'Sending...' : 'Send Contact Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <style>{`
        @media (max-width: 880px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
