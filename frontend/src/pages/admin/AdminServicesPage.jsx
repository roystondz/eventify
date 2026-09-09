import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Layers, Sparkles, Check } from 'lucide-react';
import { api, DEFAULT_SERVICES } from '../../services/api';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [toastMessage, setToastMessage] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (e) {
      console.error(e);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      name: srv.name,
      description: srv.description || '',
      price: srv.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      setToastMessage('Service removed successfully');
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.warn('API error, simulating local delete:', err);
      setServices(services.filter((s) => s.id !== id));
      setToastMessage('Service removed');
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
      if (editingService) {
        await api.updateService(editingService.id, payload);
        setToastMessage('Service updated successfully!');
      } else {
        await api.createService(payload);
        setToastMessage('New service added successfully!');
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      console.warn('API sync error, updating local state:', err);
      if (editingService) {
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...payload } : s));
      } else {
        setServices([...services, { id: Date.now(), ...payload }]);
      }
      setToastMessage('Service saved');
      setIsModalOpen(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Event Services
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage individual production services, stage decor, audio/visual setups, and pricing.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Price (KD)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Loading services...
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No services found. Click "Add New Service" to create one.
                </td>
              </tr>
            ) : (
              filteredServices.map((srv) => (
                <tr key={srv.id}>
                  <td style={{ fontWeight: '600', color: 'var(--light-champagne)' }}>
                    {srv.name}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
                    {srv.description || 'No description'}
                  </td>
                  <td style={{ fontWeight: '700', color: '#FFF' }}>
                    KD{Number(srv.price).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.6rem',
                          color: 'var(--light-champagne)',
                          cursor: 'pointer',
                        }}
                        title="Edit Service"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(srv.id)}
                        style={{
                          background: 'rgba(214, 45, 112, 0.15)',
                          border: '1px solid var(--border-pink)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.6rem',
                          color: '#FFA5C9',
                          cursor: 'pointer',
                        }}
                        title="Delete Service"
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

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        subtitle="Configure service title, description, and base pricing"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Service Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Architectural Uplighting & Haze"
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
              placeholder="e.g. 950"
              className="form-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Detailed Description</label>
            <textarea
              rows={4}
              placeholder="Describe the inclusions, technical specs, and features of this service..."
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} />
              <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
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
