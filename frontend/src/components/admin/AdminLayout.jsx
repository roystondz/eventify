import React from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  PlusCircle,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function AdminLayout() {
  const { isAuthenticated, adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Add-ons', path: '/admin/addons', icon: PlusCircle },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    { label: 'Admin Team', path: '/admin/admins', icon: Users },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/assets/brand/logo-full.png" alt="Eventify" style={{ height: '32px', width: 'auto' }} />
          </Link>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--light-champagne)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.5rem',
            }}
          >
            Management Console
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '1.25rem 0', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-pink)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem',
              }}
            >
              {adminUser?.username ? adminUser.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#FFFFFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {adminUser?.username || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--light-champagne)' }}>
                Master Access
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/"
              target="_blank"
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(214, 45, 112, 0.15)',
                border: '1px solid var(--border-pink)',
                color: '#FFA5C9',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
              <Sparkles size={12} />
              <span>Eventify Admin</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/" className="btn btn-outline btn-sm">
              <ExternalLink size={14} />
              <span>View Frontend</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-primary btn-sm">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
