import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Sparkles, Check } from 'lucide-react';
import { api, DEFAULT_ADDONS } from '../../services/api';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [toastMessage, setToastMessage] = useState('');

  const loadAddons = async () => {
    setLoading(true);
    try {
      const data = await api.getAddons();
      setAddons(data);
    } catch (e) {
      console.error(e);
      setAddons(DEFAULT_ADDONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddons();
  }, []);

  const handleOpenAdd = () => {
    setEditingAddon(null);
    setFormData({ name: '', description: '', price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      description: addon.description || '',
      price: addon.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this addon?')) return;
    try {
      await api.deleteAddon(id);
      setToastMessage('Addon removed');
      setAddons(addons.filter((a) => a.id !== id));
    } catch (err) {
      console.warn('API error, updating local state:', err);
      setAddons(addons.filter((a) => a.id !== id));
      setToastMessage('Addon removed');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
    };

    try {
      if (editingAddon) {
        await api.updateAddon(editingAddon.id, payload);
        setToastMessage('Addon updated successfully!');
      } else {
        await api.createAddon(payload);
        setToastMessage('New addon created successfully!');
      }
      setIsModalOpen(false);
      loadAddons();
    } catch (err) {
      console.warn('API sync error, updating local state:', err);
      if (editingAddon) {
        setAddons(addons.map(a => a.id === editingAddon.id ? { ...a, ...payload } : a));
      } else {
        setAddons([...addons, { id: Date.now(), ...payload }]);
      }
      setToastMessage('Addon saved');
      setIsModalOpen(false);
    }
  };

  const filteredAddons = addons.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Event Add-ons & Effects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage special effects (cold sparks, low fog, 360 photobooth, drones) and upgrade equipment.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Add-on</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search addons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Addons Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Add-on Name</th>
              <th>Description & Details</th>
              <th>Unit Price (KD)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Loading addons...
                </td>
              </tr>
            ) : filteredAddons.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No addons found. Click "Add New Add-on" to create one.
                </td>
              </tr>
            ) : (
              filteredAddons.map((add) => (
                <tr key={add.id}>
                  <td style={{ fontWeight: '600', color: 'var(--light-champagne)' }}>
                    {add.name}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
                    {add.description || 'No description'}
                  </td>
                  <td style={{ fontWeight: '700', color: '#FFF' }}>
                    KD{Number(add.price).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(add)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.6rem',
                          color: 'var(--light-champagne)',
                          cursor: 'pointer',
                        }}
                        title="Edit Addon"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(add.id)}
                        style={{
                          background: 'rgba(214, 45, 112, 0.15)',
                          border: '1px solid var(--border-pink)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.6rem',
                          color: '#FFA5C9',
                          cursor: 'pointer',
                        }}
                        title="Delete Addon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Addon */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddon ? 'Edit Add-on' : 'Create New Add-on'}
        subtitle="Configure upgrade effect, description, and pricing"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Add-on Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. 360-Degree Video Booth with Props"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 650"
              className="form-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              placeholder="Describe equipment specifications, duration, and safety features..."
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} />
              <span>{editingAddon ? 'Save Add-on' : 'Create Add-on'}</span>
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
