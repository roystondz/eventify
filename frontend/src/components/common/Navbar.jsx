import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Shield, PhoneCall, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Services', path: '/services' },
    { name: 'Event Builder', path: '/calculator' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all var(--transition-smooth)',
        backgroundColor: scrolled ? 'rgba(10, 3, 5, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src="/assets/brand/logo-full.png"
            alt="Eventify"
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              // fallback if image not found
              e.currentTarget.style.display = 'none';
              const span = e.currentTarget.nextElementSibling;
              if (span) span.style.display = 'block';
            }}
          />
          <span
            className="font-bebas"
            style={{
              display: 'none',
              fontSize: '2rem',
              letterSpacing: '0.1em',
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EVENTIFY
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--light-champagne)' : 'var(--main-text)',
                  position: 'relative',
                  padding: '0.4rem 0',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--gradient-pink)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          <Link to="/calculator" className="btn btn-primary btn-sm">
            <Sparkles size={16} />
            <span>Build Your Event</span>
          </Link>
          
          <Link
            to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
            }}
            title="Admin Portal"
          >
            <Shield size={14} color="var(--light-champagne)" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          className="mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--main-text)',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(12, 4, 8, 0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                color: location.pathname === link.path ? 'var(--button-highlight)' : 'var(--main-text)',
                padding: '0.4rem 0',
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />
          <Link to="/calculator" className="btn btn-primary" style={{ width: '100%' }}>
            <Sparkles size={18} />
            <span>Build Your Event</span>
          </Link>
          <Link
            to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: '0.9rem' }}
          >
            <Shield size={16} />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}

      {/* CSS helper for responsive display */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
