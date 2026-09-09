import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Sparkles, Check, X, Tag } from 'lucide-react';
import { api, DEFAULT_PACKAGES } from '../../services/api';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    savings: '',
    items: [''],
  });
  const [toastMessage, setToastMessage] = useState('');

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getPackages();
      setPackages(data);
    } catch (e) {
      console.error(e);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const parseItems = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return raw.split('\n').filter(Boolean);
      }
    }
    return [];
  };

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      savings: '',
      items: ['Full Event Staging & Floral Decor', 'Pro Sound & Audio Engineering', 'Intelligent Lighting Setup'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    const parsed = parseItems(pkg.items);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      savings: pkg.savings || '',
      items: parsed.length > 0 ? parsed : [''],
    });
    setIsModalOpen(true);
  };

  const handleItemChange = (idx, value) => {
    const updated = [...formData.items];
    updated[idx] = value;
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, ''] });
  };

  const handleRemoveItem = (idx) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.deletePackage(id);
      setToastMessage('Package removed');
      setPackages(packages.filter((p) => p.id !== id));
    } catch (err) {
      console.warn('API error, updating local state:', err);
      setPackages(packages.filter((p) => p.id !== id));
      setToastMessage('Package removed');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const cleanItems = formData.items.filter((i) => i.trim().length > 0);
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      savings: formData.savings,
      items: JSON.stringify(cleanItems),
    };

    try {
      if (editingPackage) {
        await api.updatePackage(editingPackage.id, payload);
        setToastMessage('Package updated successfully!');
      } else {
        await api.createPackage(payload);
        setToastMessage('New package created successfully!');
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (err) {
      console.warn('API error, updating local state:', err);
      if (editingPackage) {
        setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...payload } : p));
      } else {
        setPackages([...packages, { id: Date.now(), ...payload }]);
      }
      setToastMessage('Package saved');
      setIsModalOpen(false);
    }
  };

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Turnkey Packages
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure all-inclusive event bundles, savings promotions, and inclusions checklists.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Create New Package</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Packages Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Description & Savings</th>
              <th>Inclusions</th>
              <th>Price (KD)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Loading packages...
                </td>
              </tr>
            ) : filteredPackages.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No packages found. Click "Create New Package" to add one.
                </td>
              </tr>
            ) : (
              filteredPackages.map((pkg) => {
                const items = parseItems(pkg.items);
                return (
                  <tr key={pkg.id}>
                    <td style={{ fontWeight: '600', color: 'var(--light-champagne)' }}>
                      <div>{pkg.name}</div>
                      {pkg.savings && (
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>
                          <Tag size={10} />
                          <span>{pkg.savings}</span>
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
                      {pkg.description}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--main-text)' }}>
                      <span className="badge badge-pink" style={{ fontSize: '0.72rem' }}>
                        {items.length} Inclusions
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#FFF', fontSize: '1.05rem' }}>
                      KD{Number(pkg.price).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.4rem 0.6rem',
                            color: 'var(--light-champagne)',
                            cursor: 'pointer',
                          }}
                          title="Edit Package"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(pkg.id)}
                          style={{
                            background: 'rgba(214, 45, 112, 0.15)',
                            border: '1px solid var(--border-pink)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.4rem 0.6rem',
                            color: '#FFA5C9',
                            cursor: 'pointer',
                          }}
                          title="Delete Package"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Package */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPackage ? 'Edit Package' : 'Create New Package'}
        subtitle="Specify bundle title, pricing, promotional savings, and included features"
        maxWidth="720px"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Package Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Grandeur Luxury Wedding"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Package Price (KD) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 8500"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Savings / Promo Badge</label>
              <input
                type="text"
                placeholder="e.g. Save KD2,300 Bundle Discount"
                className="form-input"
                value={formData.savings}
                onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Package Summary Description</label>
            <textarea
              rows={3}
              placeholder="Describe what makes this package special and who it is ideal for..."
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Inclusions List Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Package Inclusions Checklist</label>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--button-highlight)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {formData.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={"Inclusion #" + (idx + 1)}
                    value={item}
                    onChange={(e) => handleItemChange(idx, e.target.value)}
                    style={{ fontSize: '0.88rem', padding: '0.6rem 0.8rem' }}
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.6rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} />
              <span>{editingPackage ? 'Save Package' : 'Create Package'}</span>
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
