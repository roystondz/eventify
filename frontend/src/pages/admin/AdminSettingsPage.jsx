import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Sparkles, Phone, Mail, MapPin, MessageSquare, Globe } from 'lucide-react';
import { api, DEFAULT_SETTINGS } from '../../services/api';
import Toast from '../../components/common/Toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((data) => {
      if (isMounted) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save all keys
      const keys = Object.keys(settings);
      for (const key of keys) {
        await api.updateSetting(key, settings[key]).catch((err) => {
          console.warn(`Could not update setting ${key}:`, err);
        });
      }
      setToastMessage('Site settings updated successfully!');
    } catch (err) {
      console.warn('API error, updated local settings:', err);
      setToastMessage('Settings saved locally');
    } finally {
      setSaving(false);
    }
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

        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          
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
                <label className="form-label">Concierge Phone Number</label>
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
      </form>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
