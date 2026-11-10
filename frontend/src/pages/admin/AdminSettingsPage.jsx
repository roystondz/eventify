import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Sparkles, Phone, Mail, MapPin, MessageSquare, Globe, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { DEFAULT_SETTINGS } from '../../services/defaults';
import Toast from '../../components/common/Toast';

// Every field on this page, so inputs stay controlled even if a key has
// never been saved.
const EMPTY_SETTINGS = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((key) => [key, '']));

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  // Last values known to be stored on the server; only changes are saved.
  const [saved, setSaved] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = { ...EMPTY_SETTINGS, ...(await api.admin.getSettings()) };
      setSettings(data);
      setSaved(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const changedKeys = Object.keys(settings).filter((key) => settings[key] !== saved[key]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (changedKeys.length === 0) {
      setToast({ message: 'No changes to save', type: 'info' });
      return;
    }

    setSaving(true);
    const results = await Promise.allSettled(
      changedKeys.map((key) => api.admin.updateSetting(key, settings[key]))
    );
    setSaving(false);

    // Store what the server saved (it trims whitespace); failed keys keep
    // their edited value so the admin can retry.
    const stored = {};
    const failed = [];
    results.forEach((result, i) => {
      const key = changedKeys[i];
      if (result.status === 'fulfilled') {
        stored[key] = result.value.value;
      } else {
        failed.push(`${key} (${result.reason.message})`);
      }
    });
    setSaved((prev) => ({ ...prev, ...stored }));
    setSettings((prev) => ({ ...prev, ...stored }));

    setToast(
      failed.length === 0
        ? { message: 'Settings saved. The public site shows them on next page load.', type: 'success' }
        : { message: `Some settings were not saved: ${failed.join(', ')}`, type: 'error' }
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Site Configuration
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage company contact numbers, WhatsApp concierge lines, address, and hero banner messaging.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving || loading || !!loadError} className="btn btn-primary">
          <Save size={16} />
          <span>{saving ? 'Saving...' : changedKeys.length ? `Save ${changedKeys.length} Change${changedKeys.length === 1 ? '' : 's'}` : 'Save Settings'}</span>
        </button>
      </div>

      {loadError && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#FFA5C9' }}>Could not load settings: {loadError}</span>
          <button onClick={load} className="btn btn-outline btn-sm">
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSave}>
        <fieldset disabled={loading || !!loadError || saving} style={{ border: 'none', padding: 0, margin: 0, minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem' }}>
          
          {/* Company Brand Settings */}
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#12050A' }}>
            <h3 className="font-bebas" style={{ fontSize: '1.5rem', color: 'var(--light-champagne)', marginBottom: '1.25rem' }}>
              Company & Branding
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Company Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Brand Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Main Hero Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.hero_headline || ''}
                  onChange={(e) => handleChange('hero_headline', e.target.value)}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  The last sentence is shown on its own line in pink.
                </p>
              </div>

              <div>
                <label className="form-label">Hero Subheadline Text</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={settings.hero_subheadline || ''}
                  onChange={(e) => handleChange('hero_subheadline', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact & Concierge Channels */}
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#12050A' }}>
            <h3 className="font-bebas" style={{ fontSize: '1.5rem', color: 'var(--light-champagne)', marginBottom: '1.25rem' }}>
              Contact & VIP Concierge
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Contact us Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+18005553836"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  Used for every "Chat on WhatsApp" button, e.g. +965 6643 3680.
                </p>
              </div>

              <div>
                <label className="form-label">Inquiry Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Instagram Profile URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.instagram_url || ''}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Physical Office / Showroom Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        </fieldset>
      </form>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
