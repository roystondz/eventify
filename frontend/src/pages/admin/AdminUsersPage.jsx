import React, { useState, useEffect } from 'react';
import { Users, Plus, Key, ShieldCheck, ShieldAlert, Trash2, Check, Lock, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  const notify = (message, type = 'success') => setToast({ message, type });
  const isSelf = (admin) => admin.username === adminUser?.username;

  const loadAdmins = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setAdmins(await api.admin.listAdmins());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.admin.createAdmin(username, password);
      notify(`Admin "${username}" created`);
      setIsCreateOpen(false);
      setUsername('');
      setPassword('');
      loadAdmins();
    } catch (err) {
      notify(`Could not create admin: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setSaving(true);
    try {
      await api.admin.changeAdminPassword(selectedAdmin.id, newPassword);
      notify(`Password updated for "${selectedAdmin.username}"`);
      setIsPasswordOpen(false);
      setNewPassword('');
    } catch (err) {
      notify(`Could not change password: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    const activate = admin.is_active !== 1;
    if (!activate && !window.confirm(`Deactivate "${admin.username}"? They will be signed out immediately.`)) return;
    try {
      await api.admin.setAdminActive(admin.id, activate);
      notify(`"${admin.username}" is now ${activate ? 'active' : 'deactivated'}`);
      loadAdmins();
    } catch (err) {
      notify(`Could not update "${admin.username}": ${err.message}`, 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            Administrator Team
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage staff login credentials, security access permissions, and password resets.
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>New Admin User</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>Created At</th>
              <th style={{ textAlign: 'right' }}>Security Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Loading administrators...
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ color: '#FFA5C9' }}>Could not load administrators: {loadError}</span>
                    <button onClick={loadAdmins} className="btn btn-outline btn-sm">
                      <RefreshCw size={14} />
                      <span>Retry</span>
                    </button>
                  </span>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td style={{ fontWeight: '600', color: 'var(--light-champagne)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(214, 45, 112, 0.2)',
                          color: 'var(--button-highlight)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                        }}
                      >
                        {admin.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{admin.username}</span>
                      {isSelf(admin) && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>(you)</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {admin.is_active === 1 ? (
                      <span className="badge" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
                        Active
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                        Disabled
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsPasswordOpen(true);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.6rem',
                          color: 'var(--light-champagne)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.78rem',
                        }}
                        title="Change Password"
                      >
                        <Key size={14} />
                        <span>Password</span>
                      </button>

                      {!isSelf(admin) && (
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          style={{
                            background: admin.is_active === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                            border: `1px solid ${admin.is_active === 1 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(74, 222, 128, 0.4)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.4rem 0.6rem',
                            color: admin.is_active === 1 ? '#EF4444' : '#4ADE80',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                          }}
                        >
                          {admin.is_active === 1 ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Admin Account"
        subtitle="Grant console administrative privileges to a team member"
      >
        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Username *</label>
            <input
              type="text"
              required
              placeholder="e.g. director_sarah"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Password *</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              <Check size={16} />
              <span>{saving ? 'Creating...' : 'Create Account'}</span>
            </button>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title={`Change Password: ${selectedAdmin?.username}`}
        subtitle="Update the security password for this administrator"
      >
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">New Password *</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              <Check size={16} />
              <span>{saving ? 'Updating...' : 'Update Password'}</span>
            </button>
            <button type="button" onClick={() => setIsPasswordOpen(false)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
