// Centralized API Client with Fallback Mock Data for instant luxury experience

const API_BASE = '';

const getToken = () => localStorage.getItem('eventify_admin_token');

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('eventify_admin_token', token);
  } else {
    localStorage.removeItem('eventify_admin_token');
  }
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Initial Seed / Fallback Data matching our sample assets
export const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Decor & Backdrop Elegance',
    description: 'Premium shimmer walls, floral backdrops, geometric neon installations, and custom monogram arches.',
    price: 45,
    image: '/assets/services/decor_and_backdrop.png',
  },
  {
    id: 2,
    name: 'Custom Theme Decor & Styling',
    description: 'Bespoke floral arches, luxurious stage setups, custom props, and personalized theme decor.',
    price: 0, // price upon request
    image: '/assets/services/custom_theme_decor.png',
  },
  {
    id: 3,
    name: 'DJ & Sound System',
    description: 'Concert‑grade audio setup, wireless microphones, and professional DJ services.',
    price: 80,
    image: '/assets/services/dj_sound.png',
  },
  {
    id: 4,
    name: 'Event Lighting',
    description: 'Intelligent moving‑head lights, uplighting, and ambience creation.',
    price: 0, // price upon request
    image: '/assets/services/event_lighting.png',
  },
  {
    id: 5,
    name: 'LED Display',
    description: 'High‑resolution LED video walls and dynamic visual content.',
    price: 0, // price upon request
    image: '/assets/services/led_display.png',
  },
  {
    id: 6,
    name: 'Host / MC',
    description: 'Charismatic multilingual hosts to keep the event flowing.',
    price: 45,
    image: '/assets/services/host_mc.png',
  },
  {
    id: 7,
    name: 'Photography',
    description: 'Editorial‑grade portrait and candid event coverage.',
    price: 45,
    image: '/assets/services/photography.png',
  },
  {
    id: 8,
    name: 'Videography',
    description: 'Cinematic 4K video capture, highlights, and drone footage.',
    price: 60,
    image: '/assets/services/videography.png',
  },
  {
    id: 9,
    name: 'Photography + Videography',
    description: 'Combined photo and video package for complete coverage.',
    price: 100,
    image: '/assets/services/photo_video_bundle.png',
  },
];

export const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: 'Eventify Essential',
    description: 'Ideal for small birthdays, intimate gatherings and simple private celebrations.',
    price: 85,
    items: JSON.stringify([
      'Decor & Backdrop Elegance',
      'Photography',
    ]),
    savings: 'You Save: 5 KD',
    image: '/assets/events/essential.png',
  },
  {
    id: 2,
    name: 'Eventify Celebration',
    description: 'Ideal for birthdays, graduations, farewell parties and private celebrations where entertainment is required.',
    price: 165,
    items: JSON.stringify([
      'Decor & Backdrop Elegance',
      'DJ & Sound System',
      'Photography',
    ]),
    savings: 'You Save: 5 KD',
    image: '/assets/events/celebration.png',
  },
  {
    id: 3,
    name: 'Eventify Complete',
    description: 'Ideal for clients who want decor, entertainment and complete media coverage.',
    price: 215,
    items: JSON.stringify([
      'Decor & Backdrop Elegance',
      'DJ & Sound System',
      'Photography',
      'Videography',
    ]),
    savings: 'You Save: 10 KD',
    image: '/assets/events/complete.png',
  },
];

export const DEFAULT_ADDONS = [
  { id: 1, name: 'Host / MC', description: 'Charismatic multilingual hosts to keep the event flowing.', price: 45 },
  { id: 2, name: 'Custom Theme Decor', description: 'Bespoke decor tailored to the client’s theme.', price: 0 }, // price upon request
  { id: 3, name: 'Event Lighting', description: 'Intelligent moving‑head lights, uplighting, and ambience creation.', price: 0 }, // price upon request
  { id: 4, name: 'LED Display', description: 'High‑resolution LED video walls and dynamic visual content.', price: 0 }, // price upon request
];

export const DEFAULT_SETTINGS = {
  company_name: 'Eventify',
  tagline: 'Your Events. Our Expertise.',
  phone: '+965 6643 3680',
  whatsapp_number: '+965 6643 3680',
  instagram_url: 'https://instagram.com/eventifykw',
  hero_headline: 'Your Events. Our Expertise.',
  hero_subheadline: 'Elevate every moment with personalized, stylish private celebrations.',
  launch_date: '31 October 2024',
  location: 'Kuwait',
  main_cta: 'Plan Your Event',
  secondary_cta: 'Chat on WhatsApp',
};

// API Methods
export const api = {
  // Public Data
  async getServices() {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Using default services fallback', e);
    }
    return DEFAULT_SERVICES;
  },

  async getPackages() {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Using default packages fallback', e);
    }
    return DEFAULT_PACKAGES;
  },

  async getAddons() {
    try {
      const res = await fetch('/api/addons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Using default addons fallback', e);
    }
    return DEFAULT_ADDONS;
  },

  async getSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          return { ...DEFAULT_SETTINGS, ...data };
        }
      }
    } catch (e) {
      console.warn('Using default settings fallback', e);
    }
    return DEFAULT_SETTINGS;
  },

  // Admin Auth
  async login(username, password) {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Invalid username or password');
    }
    const data = await res.json();
    setToken(data.token);
    return data;
  },

  // Admin Services CRUD
  async createService(service) {
    const res = await fetch('/admin/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateService(id, service) {
    const res = await fetch(`/admin/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteService(id) {
    const res = await fetch(`/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },

  // Admin Packages CRUD
  async createPackage(pkg) {
    const res = await fetch('/admin/packages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pkg),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updatePackage(id, pkg) {
    const res = await fetch(`/admin/packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pkg),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deletePackage(id) {
    const res = await fetch(`/admin/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },

  // Admin Addons CRUD
  async createAddon(addon) {
    const res = await fetch('/admin/addons', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addon),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateAddon(id, addon) {
    const res = await fetch(`/admin/addons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(addon),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteAddon(id) {
    const res = await fetch(`/admin/addons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },

  // Admin Settings
  async updateSetting(key, value) {
    const res = await fetch(`/admin/settings/${key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Admin Users
  async getAdmins() {
    const res = await fetch('/admin/admins', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async createAdmin(username, password) {
    const res = await fetch('/admin/admins', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateAdmin(id, is_active) {
    const res = await fetch(`/admin/admins/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async changeAdminPassword(id, password) {
    const res = await fetch(`/admin/admins/${id}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteAdmin(id) {
    const res = await fetch(`/admin/admins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
};
