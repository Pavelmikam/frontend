import { PROPERTY_TYPES, PROPERTY_STATUSES } from './constants';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatPriceFCFA = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('237') && cleaned.length === 12) {
    return `+237 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

export const maskEmail = (email) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local[0]}***@${domain}`;
};

export const formatPrice = (price) => {
  if (!price && price !== 0) return '—';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA/mois';
};

export const formatSurface = (surface) => {
  if (!surface) return '—';
  return `${surface} m²`;
};

export const formatRooms = (rooms) => {
  if (!rooms) return '—';
  return `${rooms} pièce${rooms > 1 ? 's' : ''}`;
};

export const getPropertyTypeLabel = (type) => {
  const found = PROPERTY_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
};

export const getStatusInfo = (status) => {
  const found = PROPERTY_STATUSES.find((s) => s.value === status);
  return found || { label: status ?? '—', color: 'gray' };
};

// ── Phase 3 formatters ────────────────────────────────────────────────────────

/**
 * Formate une date ISO en "12 jan. 2026"
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'd MMM yyyy', { locale: fr });
  } catch {
    return '—';
  }
};

/**
 * Formate une date en relatif "il y a 3 jours"
 */
export const formatRelativeDate = (isoString) => {
  if (!isoString) return '—';
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true, locale: fr });
  } catch {
    return '—';
  }
};

/**
 * Formate un prix court pour les sliders. Ex: 150000 → "150 000 F"
 */
export const formatPriceShort = (price) => {
  if (price === null || price === undefined) return '—';
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
};

/**
 * Sérialise les filtres en query string URL.
 * Gère les tableaux : amenities[]=val1&amenities[]=val2
 */
export const filtersToQueryString = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      value.forEach((v) => params.append(`${key}[]`, v));
    } else {
      params.set(key, value);
    }
  });
  return params.toString();
};

/**
 * Désérialise les URLSearchParams en objet filtres.
 * Reconstitue les tableaux depuis les clés[] en tableau JS.
 */
export const queryStringToFilters = (searchParams) => {
  const filters = {};
  searchParams.forEach((value, key) => {
    const cleanKey = key.replace('[]', '');
    if (key.endsWith('[]')) {
      if (!filters[cleanKey]) filters[cleanKey] = [];
      filters[cleanKey].push(value);
    } else {
      filters[cleanKey] = value;
    }
  });
  return filters;
};
