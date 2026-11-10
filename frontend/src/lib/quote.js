// Event builder pricing. A price of 0 means "price upon request": the item
// is listed but not added to the total. The backend repeats this calculation
// when an inquiry is submitted, so keep the two in sync
// (backend/src/routes/inquiries.js → buildQuote).

const normalize = (name) => String(name ?? '').trim().toLowerCase();

export function parseItems(items) {
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return items.split('\n').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

// Names of the services a package already contains, lowercased.
export function includedServiceNames(pkg) {
  return new Set(pkg ? parseItems(pkg.items).map(normalize) : []);
}

export function isIncludedInPackage(service, pkg) {
  return includedServiceNames(pkg).has(normalize(service.name));
}

const priced = (item) => (Number(item.price) > 0 ? Number(item.price) : 0);

export function calculateQuote({ pkg = null, services = [], addons = [] }) {
  const included = includedServiceNames(pkg);
  const chargedServices = services.filter((service) => !included.has(normalize(service.name)));
  const extras = [...chargedServices, ...addons];

  return {
    chargedServices,
    total: (pkg ? priced(pkg) : 0) + extras.reduce((sum, item) => sum + priced(item), 0),
    hasPriceOnRequest: extras.some((item) => !(Number(item.price) > 0)),
  };
}

export function formatKD(amount, { onRequest = false } = {}) {
  return `KD ${Number(amount).toLocaleString()}${onRequest ? '+' : ''}`;
}

export function formatItemPrice(item) {
  return Number(item.price) > 0 ? formatKD(item.price) : 'Price upon request';
}
