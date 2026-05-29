export const ROLES = {
  LOCATAIRE: 'locataire',
  PROPRIETAIRE: 'proprietaire',
  ADMIN: 'admin',
};

export const ROUTES = {
  LOGIN:              '/login',
  REGISTER:           '/register',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',
  VERIFY_EMAIL:       '/verify-email',
  DASHBOARD:          '/dashboard',
  PROFILE:            '/profile',
  ANNONCES:           '/annonces',
  MES_ANNONCES:       '/mes-annonces',
  MES_ANNONCES_CREER: '/mes-annonces/creer',
  ADMIN_MODERATION:   '/admin/moderation',
  MES_FAVORIS:        '/mes-favoris',
  MES_RECHERCHES:     '/mes-recherches',
};

export const API_ROUTES = {
  // Auth
  AUTH_REGISTER:        '/api/auth/register',
  AUTH_LOGIN:           '/api/auth/login',
  AUTH_LOGOUT:          '/api/auth/logout',
  AUTH_ME:              '/api/auth/me',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD:  '/api/auth/reset-password',
  AUTH_VERIFY_EMAIL:    '/api/auth/email/verify',
  AUTH_RESEND_VERIFY:   '/api/auth/email/resend',
  // Profil
  USER_PROFILE: '/api/user/profile',
  USER_AVATAR:  '/api/user/avatar',
  USER_PASSWORD: '/api/user/password',
  // Properties
  PROPERTIES:               '/api/properties',
  PROPERTIES_MAP:           '/api/properties/map',
  PROPERTY:                 (id) => `/api/properties/${id}`,
  PROPERTY_STATUS:          (id) => `/api/properties/${id}/status`,
  PROPERTY_IMAGES:          (id) => `/api/properties/${id}/images`,
  PROPERTY_IMAGE:           (id, imgId) => `/api/properties/${id}/images/${imgId}`,
  PROPERTY_IMAGES_REORDER:  (id) => `/api/properties/${id}/images/reorder`,
  PROPERTY_IMAGE_PRIMARY:   (id, imgId) => `/api/properties/${id}/images/${imgId}/primary`,
  MY_PROPERTIES:            '/api/my-properties',
  ADMIN_PROPERTIES_PENDING: '/api/admin/properties/pending',
  ADMIN_PROPERTY_MODERATE:  (id) => `/api/admin/properties/${id}/moderate`,
  // Favorites
  FAVORITES:                '/api/favorites',
  FAVORITE_TOGGLE:          (id) => `/api/favorites/${id}`,
  FAVORITE_CHECK:           (id) => `/api/favorites/${id}/check`,
  // Saved searches
  SAVED_SEARCHES:             '/api/saved-searches',
  SAVED_SEARCH:               (id) => `/api/saved-searches/${id}`,
  SAVED_SEARCH_RESULTS:       (id) => `/api/saved-searches/${id}/results`,
  SAVED_SEARCH_TOGGLE_NOTIF:  (id) => `/api/saved-searches/${id}/toggle-notifications`,
};

export const PROPERTY_TYPES = [
  { value: 'chambre_simple',    label: 'Chambre simple' },
  { value: 'studio',            label: 'Studio' },
  { value: 'appartement',       label: 'Appartement' },
  { value: 'maison',            label: 'Maison' },
  { value: 'mini_cite',         label: 'Mini cité' },
  { value: 'local_commercial',  label: 'Local commercial' },
  { value: 'chambre_etudiante', label: 'Chambre étudiante' },
  { value: 'logement_meuble',   label: 'Logement meublé' },
];

export const PROPERTY_STATUSES = [
  { value: 'disponible',       label: 'Disponible',       color: 'green' },
  { value: 'sous_reservation', label: 'Sous réservation', color: 'yellow' },
  { value: 'loue',             label: 'Loué',             color: 'red' },
  { value: 'en_travaux',       label: 'En travaux',       color: 'orange' },
  { value: 'suspendu',         label: 'Suspendu',         color: 'gray' },
];

export const AMENITIES = [
  { value: 'eau_courante',       label: 'Eau courante',       icon: '💧' },
  { value: 'electricite',        label: 'Électricité',        icon: '⚡' },
  { value: 'climatisation',      label: 'Climatisation',      icon: '❄️' },
  { value: 'groupe_electrogene', label: 'Groupe électrogène', icon: '🔋' },
  { value: 'internet_wifi',      label: 'Internet / WiFi',    icon: '📶' },
  { value: 'parking',            label: 'Parking',            icon: '🅿️' },
  { value: 'cloture',            label: 'Clôture',            icon: '🔒' },
  { value: 'gardien',            label: 'Gardien',            icon: '👮' },
  { value: 'meuble',             label: 'Meublé',             icon: '🛋️' },
  { value: 'cuisine_equipee',    label: 'Cuisine équipée',    icon: '🍳' },
];

export const CHARGES_INCLUDED = [
  { value: 'eau',         label: 'Eau' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'gardien',     label: 'Gardien' },
  { value: 'ordures',     label: 'Ordures ménagères' },
];

export const CITIES_CAMEROUN = [
  'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi',
  'Limbe', 'Buea', 'Kumba', 'Edéa', 'Nkongsamba',
];

export const SORT_OPTIONS = [
  { value: 'newest',     label: 'Plus récentes' },
  { value: 'oldest',     label: 'Plus anciennes' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popular',    label: 'Plus vues' },
  { value: 'relevance',  label: 'Pertinence' },
];

export const PRICE_RANGE = {
  min: 0,
  max: 500000,
  step: 5000,
  default: [0, 500000],
};

export const SURFACE_RANGE = {
  min: 0,
  max: 500,
  step: 5,
  default: [0, 500],
};

export const RADIUS_OPTIONS = [
  { value: 1,  label: '1 km' },
  { value: 2,  label: '2 km' },
  { value: 5,  label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
];

export const MAX_SAVED_SEARCHES = 10;
