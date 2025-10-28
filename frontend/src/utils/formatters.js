// Shared formatting utilities that respect app Settings stored in localStorage

const DEFAULT_SETTINGS = {
  currency: 'INR',
  dateFormat: 'MM/DD/YYYY',
};

export function getAppSettings() {
  try {
    const raw = localStorage.getItem('appSettings');
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (_) {
    return { ...DEFAULT_SETTINGS };
  }
}

export function formatCurrency(value) {
  const { currency } = getAppSettings();
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch (_) {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function getCurrencySymbol(cur) {
  try {
    const currency = cur || getAppSettings().currency;
    const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(0);
    const sym = parts.find(p => p.type === 'currency')?.value;
    if (sym) return sym;
  } catch (_) {}
  // Fallback map
  const map = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', INR: '₹' };
  return map[(cur || getAppSettings().currency)] || '$';
}

// Very small date formatter supporting three patterns
export function formatDate(input) {
  const { dateFormat } = getAppSettings();
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${yyyy}`;
    case 'YYYY-MM-DD':
      return `${yyyy}-${mm}-${dd}`;
    case 'MM/DD/YYYY':
    default:
      return `${mm}/${dd}/${yyyy}`;
  }
}
