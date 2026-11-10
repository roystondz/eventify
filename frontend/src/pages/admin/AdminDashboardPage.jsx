import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Package,
  PlusCircle,
  Settings,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [recentPackages, setRecentPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  // null while checking, then true / false.
  const [apiHealthy, setApiHealthy] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Each count loads independently so one failure doesn't blank the page.
    const count = (promise) => promise.then((items) => items.length).catch(() => null);

    Promise.all([
      count(api.admin.services.list()),
      api.admin.packages.list().catch(() => null),
      count(api.admin.addons.list()),
      count(api.admin.listAdmins()),
      api.admin.listInquiries().catch(() => null),
      fetch('/api/health').then((res) => res.ok).catch(() => false),
    ]).then(([servicesCount, packages, addonsCount, adminsCount, inquiries, healthy]) => {
      if (!isMounted) return;
      setStats({
        servicesCount,
        packagesCount: packages ? packages.length : null,
        addonsCount,
        adminsCount,
        newInquiriesCount: inquiries ? inquiries.filter((i) => i.status === 'new').length : null,
      });
      setRecentPackages(packages ? packages.slice(0, 4) : []);
      setApiHealthy(healthy);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { label: 'New Inquiries', count: stats.newInquiriesCount, icon: Inbox, link: '/admin/inquiries', color: '#4ADE80' },
    { label: 'Active Packages', count: stats.packagesCount, icon: Package, link: '/admin/packages', color: 'var(--button-highlight)' },
    { label: 'Live Services', count: stats.servicesCount, icon: Layers, link: '/admin/services', color: 'var(--gold-accent)' },
    { label: 'Event Add-ons', count: stats.addonsCount, icon: PlusCircle, link: '/admin/addons', color: 'var(--light-champagne)' },
    { label: 'Admin Users', count: stats.adminsCount, icon: Users, link: '/admin/admins', color: '#60A5FA' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-bebas" style={{ fontSize: '2.4rem', color: 'var(--light-champagne)', letterSpacing: '0.04em' }}>
            System Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live status of your services, custom packages, inventory addons, and system health.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/packages" className="btn btn-primary btn-sm">
            <Package size={15} />
            <span>Manage Packages</span>
          </Link>
          <Link to="/admin/services" className="btn btn-outline btn-sm">
            <Layers size={15} />
            <span>Manage Services</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              textDecoration: 'none',
              backgroundColor: '#12050A',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <card.icon size={22} />
              </div>
              <ArrowUpRight size={18} color="var(--text-muted)" />
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {card.label}
              </div>
              <div className="font-bebas" style={{ fontSize: '2.5rem', color: '#FFFFFF', lineHeight: '1.1', marginTop: '0.2rem' }}>
                {loading ? '...' : card.count ?? '—'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout: Quick Actions & Live Packages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="admin-dash-grid">
        {/* Recent Packages Preview */}
        <div className="admin-table-wrapper" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="font-bebas" style={{ fontSize: '1.5rem', color: 'var(--light-champagne)' }}>
              Live Package Catalog
            </h3>
            <Link to="/admin/packages" style={{ fontSize: '0.82rem', color: 'var(--button-highlight)', fontWeight: '600' }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!loading && recentPackages.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No packages yet. <Link to="/admin/packages" style={{ color: 'var(--button-highlight)' }}>Create one</Link>.
              </p>
            )}
            {recentPackages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--main-text)', fontSize: '0.95rem' }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--light-champagne)', marginTop: '0.2rem' }}>
                    {pkg.savings || 'Turnkey Suite'}
                  </div>
                </div>
                <div className="font-bebas" style={{ fontSize: '1.4rem', color: '#FFF' }}>
                  KD {Number(pkg.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Fast Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#12050A' }}>
            <h3 className="font-bebas" style={{ fontSize: '1.5rem', color: 'var(--light-champagne)', marginBottom: '1rem' }}>
              Backend API Status
            </h3>

            {(() => {
              const color = apiHealthy === null ? 'var(--text-muted)' : apiHealthy ? '#4ADE80' : '#EF4444';
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
                  <span style={{ fontWeight: '600', color, fontSize: '0.92rem' }}>
                    {apiHealthy === null ? 'Checking...' : apiHealthy ? 'API Operational' : 'API Unreachable'}
                  </span>
                </div>
              );
            })()}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>• Backend: Node.js + Express</div>
              <div>• Database: SQLite</div>
              <div>• Sessions: JWT, expire after 24 hours</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#12050A' }}>
            <h3 className="font-bebas" style={{ fontSize: '1.5rem', color: 'var(--light-champagne)', marginBottom: '1rem' }}>
              Quick Settings
            </h3>
            <Link to="/admin/settings" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <Settings size={15} />
              <span>Configure Site Info & WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-dash-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
