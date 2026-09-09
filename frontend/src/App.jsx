import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Components & Pages
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import ServicesPage from './pages/ServicesPage';
import CalculatorPage from './pages/CalculatorPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AdminAddonsPage from './pages/admin/AdminAddonsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function ClientLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Client Routes */}
          <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
          <Route path="/packages" element={<ClientLayout><PackagesPage /></ClientLayout>} />
          <Route path="/services" element={<ClientLayout><ServicesPage /></ClientLayout>} />
          <Route path="/calculator" element={<ClientLayout><CalculatorPage /></ClientLayout>} />
          <Route path="/gallery" element={<ClientLayout><GalleryPage /></ClientLayout>} />
          <Route path="/contact" element={<ClientLayout><ContactPage /></ClientLayout>} />

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="addons" element={<AdminAddonsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="admins" element={<AdminUsersPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
