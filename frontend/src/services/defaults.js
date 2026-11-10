// Fallback content for the public site, used only when the backend can't be
// reached. Mirrors the data seeded by backend/src/db/migrations/0003_seed_catalog.sql.
// The admin panel never uses these: it always shows what is in the database.

export const DEFAULT_SERVICES = [
  { id: 1, name: 'Decor & Backdrop Elegance', description: 'Premium shimmer walls, floral backdrops, geometric neon installations, and custom monogram arches.', price: 45, image: '/assets/services/decor and backdrop.webp' },
  { id: 2, name: 'Custom Theme Decor & Styling', description: 'Fully personalized floral arches, luxurious stage setups, custom props, and personalized theme decor.', price: 0, image: '/assets/services/custom theme decor.webp' },
  { id: 3, name: 'DJ & Sound System', description: 'Concert-grade audio setup, wireless microphones, and professional DJ services.', price: 80, image: '/assets/services/dj and sound system.webp' },
  { id: 4, name: 'Event Lighting', description: 'Intelligent moving-head lights, uplighting, and ambience creation.', price: 0, image: '/assets/services/event lighting.webp' },
  { id: 5, name: 'LED Display', description: 'High-resolution LED video walls and dynamic visual content.', price: 0, image: '/assets/services/led display.webp' },
  { id: 6, name: 'Host / MC', description: 'Charismatic multilingual hosts to keep the event flowing.', price: 45, image: '/assets/services/host_mc.webp' },
  { id: 7, name: 'Photography', description: 'Editorial-grade portrait and candid event coverage.', price: 45, image: '/assets/services/photography.webp' },
  { id: 8, name: 'Videography', description: 'Cinematic 4K video capture, highlights, and drone footage.', price: 60, image: '/assets/services/videography.webp' },
  { id: 9, name: 'Photography + Videography', description: 'Combined photo and video package for complete coverage.', price: 100, image: '/assets/services/photography.webp' },
];

export const DEFAULT_PACKAGES = [
  { id: 1, name: 'Eventify Essential', description: 'Ideal for small birthdays, intimate gatherings and simple private celebrations.', price: 85, items: ['Decor & Backdrop Elegance', 'Photography'], savings: 'You Save: 5 KD' },
  { id: 2, name: 'Eventify Celebration', description: 'Ideal for birthdays, graduations, farewell parties and private celebrations where entertainment is required.', price: 165, items: ['Decor & Backdrop Elegance', 'DJ & Sound System', 'Photography'], savings: 'You Save: 5 KD' },
  { id: 3, name: 'Eventify Complete', description: 'Ideal for clients who want decor, entertainment and complete media coverage.', price: 215, items: ['Decor & Backdrop Elegance', 'DJ & Sound System', 'Photography', 'Videography'], savings: 'You Save: 10 KD' },
];

export const DEFAULT_ADDONS = [
  { id: 1, name: 'Host / MC', description: 'Charismatic multilingual hosts to keep the event flowing.', price: 45 },
  { id: 2, name: 'Custom Theme Decor', description: 'Fully personalized decor tailored to the client’s theme.', price: 0 },
  { id: 3, name: 'Event Lighting', description: 'Intelligent moving-head lights, uplighting, and ambience creation.', price: 0 },
  { id: 4, name: 'LED Display', description: 'High-resolution LED video walls and dynamic visual content.', price: 0 },
];

export const DEFAULT_SETTINGS = {
  company_name: 'Eventify',
  tagline: 'Your Events. Our Expertise.',
  hero_headline: 'Elevate Every Moment. We Create Experiences.',
  hero_subheadline: 'From grand fairytale weddings and high-profile corporate galas to exclusive VIP parties, we blend breathtaking floral decor, concert-grade sound, intelligent lighting, and seamless production.',
  phone: '+965 6643 3680',
  whatsapp_number: '+965 6643 3680',
  email: '',
  instagram_url: 'https://instagram.com/eventifykw',
  address: 'Kuwait',
};
