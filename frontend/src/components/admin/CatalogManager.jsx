import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Check, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import { formatItemPrice } from '../../lib/quote';

const EMPTY_FORM = { name: '', description: '', price: '', image: '' };

// Admin CRUD table for a simple catalog resource (services, add-ons).
// `resource` is one of api.admin.services / api.admin.addons.
export default function CatalogManager({ resource, copy, withImage = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const notify = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setItems(await resource.list());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenAdd = () => {
    setEditing(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await resource.remove(item.id);
      setItems((current) => current.filter((i) => i.id !== item.id));
      notify(`${copy.noun} deleted`);
    } catch (err) {
      notify(`Could not delete: ${err.message}`, 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      ...(withImage ? { image: formData.image } : {}),
    };

    setSaving(true);
    try {
      if (editing) {
        await resource.update(editing.id, payload);
        notify(`${copy.noun} updated`);
      } else {
        await resource.create(payload);
        notify(`${copy.noun} created`);
      }
      setIsModalOpen(false);
      load();
    } catch (err) {
      notify(`Could not save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const query = searchTerm.toLowerCase();
  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
  );

  const columns = 4;
  const emptyCell = (content) => (
    <tr>
      <td colSpan={columns} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        {content}
      </td>
    </tr>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            {copy.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{copy.description}</p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New {copy.noun}</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder={`Search ${copy.plural.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.noun} Name</th>
              <th>Description</th>
              <th>Price</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? emptyCell(`Loading ${copy.plural.toLowerCase()}...`)
              : loadError
                ? emptyCell(
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <span style={{ color: '#FFA5C9' }}>Could not load {copy.plural.toLowerCase()}: {loadError}</span>
                      <button onClick={load} className="btn btn-outline btn-sm">
                        <RefreshCw size={14} />
                        <span>Retry</span>
                      </button>
                    </span>
                  )
                : filtered.length === 0
                  ? emptyCell(
                      items.length === 0
                        ? `No ${copy.plural.toLowerCase()} yet. Click "Add New ${copy.noun}" to create one.`
                        : 'No matches for your search.'
                    )
                  : filtered.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: '600', color: 'var(--light-champagne)' }}>{item.name}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
                          {item.description || 'No description'}
                        </td>
                        <td style={{ fontWeight: '700', color: '#FFF', whiteSpace: 'nowrap' }}>{formatItemPrice(item)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.4rem 0.6rem',
                                color: 'var(--light-champagne)',
                                cursor: 'pointer',
                              }}
                              title={`Edit ${copy.noun}`}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              onClick={() => handleDelete(item)}
                              style={{
                                background: 'rgba(214, 45, 112, 0.15)',
                                border: '1px solid var(--border-pink)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.4rem 0.6rem',
                                color: '#FFA5C9',
                                cursor: 'pointer',
                              }}
                              title={`Delete ${copy.noun}`}
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? `Edit ${copy.noun}` : `Add New ${copy.noun}`}
        subtitle={copy.modalSubtitle}
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">{copy.noun} Name *</label>
            <input
              type="text"
              required
              placeholder={copy.namePlaceholder}
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Price (KD) *</label>
            <input
              type="number"
              step="0.001"
              min="0"
              required
              placeholder="e.g. 45"
              className="form-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              Enter 0 to show "Price upon request".
            </p>
          </div>

          {withImage && (
            <div>
              <label className="form-label">Image</label>
              <input
                type="text"
                placeholder="/assets/services/photography.webp"
                className="form-input"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                A path under /assets/ or an https:// URL. Leave empty to pick an image automatically.
              </p>
            </div>
          )}

          <div>
            <label className="form-label">Description</label>
            <textarea
              rows={4}
              placeholder={copy.descriptionPlaceholder}
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              <Check size={16} />
              <span>{saving ? 'Saving...' : editing ? 'Save Changes' : `Create ${copy.noun}`}</span>
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
