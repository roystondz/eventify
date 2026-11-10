import React, { useEffect, useState } from 'react';
import { Inbox, Mail, Phone, MessageSquare, Trash2, RefreshCw, Calendar, Users } from 'lucide-react';
import { api } from '../../services/api';
import { formatItemPrice, formatKD } from '../../lib/quote';
import { whatsappLink } from '../../lib/whatsapp';
import Toast from '../../components/common/Toast';

const STATUSES = [
  { value: 'new', label: 'New', color: '#4ADE80' },
  { value: 'contacted', label: 'Contacted', color: '#60A5FA' },
  { value: 'booked', label: 'Booked', color: 'var(--gold-accent)' },
  { value: 'closed', label: 'Closed', color: 'var(--text-muted)' },
];

const statusColor = (value) => STATUSES.find((s) => s.value === value)?.color ?? 'var(--text-muted)';

function formatDateTime(iso) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
}

function Detail({ icon: Icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--main-text)', fontSize: '0.85rem' }}>
      <Icon size={14} color="var(--gold-accent)" />
      {children}
    </span>
  );
}

function SelectionSummary({ inquiry }) {
  const { selection } = inquiry;
  const lines = [
    ...(selection.package ? [{ label: `Package: ${selection.package.name}`, price: formatKD(selection.package.price) }] : []),
    ...(selection.services ?? []).map((s) => ({ label: `+ ${s.name}`, price: formatItemPrice(s) })),
    ...(selection.addons ?? []).map((a) => ({ label: `+ ${a.name}`, price: formatItemPrice(a) })),
  ];

  if (lines.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem', padding: '0.2rem 0' }}>
          <span>{line.label}</span>
          <span style={{ color: 'var(--light-champagne)', whiteSpace: 'nowrap' }}>{line.price}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 700 }}>
        <span>Estimated total</span>
        <span>{formatKD(inquiry.estimated_total, { onRequest: inquiry.has_price_on_request })}</span>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const notify = (message, type = 'success') => setToast({ message, type });

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setInquiries(await api.admin.listInquiries());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (inquiry, status) => {
    try {
      const updated = await api.admin.setInquiryStatus(inquiry.id, status);
      setInquiries((current) => current.map((i) => (i.id === inquiry.id ? updated : i)));
    } catch (err) {
      notify(`Could not update status: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (inquiry) => {
    if (!window.confirm(`Delete the inquiry from ${inquiry.name}? This cannot be undone.`)) return;
    try {
      await api.admin.deleteInquiry(inquiry.id);
      setInquiries((current) => current.filter((i) => i.id !== inquiry.id));
      notify('Inquiry deleted');
    } catch (err) {
      notify(`Could not delete: ${err.message}`, 'error');
    }
  };

  const counts = Object.fromEntries(STATUSES.map((s) => [s.value, inquiries.filter((i) => i.status === s.value).length]));
  const visible = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Client Inquiries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Requests sent from the contact form and the event builder.
          </p>
        </div>

        <button onClick={load} className="btn btn-outline btn-sm" disabled={loading}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[{ value: 'all', label: 'All', count: inquiries.length }, ...STATUSES.map((s) => ({ ...s, count: counts[s.value] }))].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              border: `1px solid ${filter === option.value ? 'var(--button-highlight)' : 'var(--border-subtle)'}`,
              background: filter === option.value ? 'var(--gradient-pink)' : 'rgba(255, 255, 255, 0.03)',
              color: '#FFF',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-table-wrapper" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading inquiries...
        </div>
      ) : loadError ? (
        <div className="admin-table-wrapper" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <span style={{ color: '#FFA5C9' }}>Could not load inquiries: {loadError}</span>{' '}
          <button onClick={load} className="btn btn-outline btn-sm" style={{ marginLeft: '0.75rem' }}>
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="admin-table-wrapper" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Inbox size={32} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          {inquiries.length === 0 ? 'No inquiries yet. They will appear here when clients submit a form.' : 'No inquiries with this status.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visible.map((inquiry) => (
            <article key={inquiry.id} className="admin-table-wrapper" style={{ padding: '1.5rem', borderLeft: `3px solid ${statusColor(inquiry.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--light-champagne)', fontSize: '1.05rem' }}>{inquiry.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {inquiry.source === 'builder' ? 'Event builder' : 'Contact form'} · {formatDateTime(inquiry.created_at)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="form-select"
                    aria-label={`Status of inquiry from ${inquiry.name}`}
                    value={inquiry.status}
                    onChange={(e) => handleStatus(inquiry, e.target.value)}
                    style={{ padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.82rem', width: 'auto' }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(inquiry)}
                    aria-label={`Delete inquiry from ${inquiry.name}`}
                    title="Delete inquiry"
                    style={{
                      background: 'rgba(214, 45, 112, 0.15)',
                      border: '1px solid var(--border-pink)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.6rem',
                      color: '#FFA5C9',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <Detail icon={Mail}>
                  <a href={`mailto:${inquiry.email}`} style={{ color: 'inherit' }}>{inquiry.email}</a>
                </Detail>
                {inquiry.phone && (
                  <>
                    <Detail icon={Phone}>
                      <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`} style={{ color: 'inherit' }}>{inquiry.phone}</a>
                    </Detail>
                    <Detail icon={MessageSquare}>
                      <a
                        href={whatsappLink(inquiry.phone, [`Hello ${inquiry.name}, this is Eventify following up on your inquiry.`])}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit' }}
                      >
                        WhatsApp
                      </a>
                    </Detail>
                  </>
                )}
                {inquiry.event_type && <Detail icon={Inbox}>{inquiry.event_type}</Detail>}
                {inquiry.event_date && <Detail icon={Calendar}>{new Date(`${inquiry.event_date}T00:00:00`).toLocaleDateString()}</Detail>}
                {inquiry.guest_count && <Detail icon={Users}>{inquiry.guest_count} guests</Detail>}
              </div>

              {inquiry.message && (
                <p style={{ marginTop: '1rem', color: 'var(--main-text)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {inquiry.message}
                </p>
              )}

              <SelectionSummary inquiry={inquiry} />
            </article>
          ))}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
