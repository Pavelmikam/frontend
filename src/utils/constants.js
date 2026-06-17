export const ROLES = {
  LOCATAIRE: 'locataire',
  PROPRIETAIRE: 'proprietaire',
  ADMIN: 'admin',
};

export const ROUTES = {
  HOME:               '/',
  LOGIN:              '/login',
  REGISTER:           '/register',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',
  VERIFY_EMAIL:       '/verify-email',
  DASHBOARD:          '/dashboard',
  PROFILE:            '/profile',

  // Annonces publiques
  ANNONCES:           '/annonces',
  ANNONCE:            (id) => `/annonces/${id}`,
  ANNONCES_POPULAIRES: '/annonces/populaires',

  // Propriétaire
  MES_ANNONCES:            '/mes-annonces',
  MES_ANNONCES_CREER:      '/mes-annonces/creer',
  MES_ANNONCES_MODIFIER:   (id) => `/mes-annonces/${id}/modifier`,
  MES_ANNONCES_STATS:      (id) => `/mes-annonces/${id}/stats`,
  MES_ANNONCES_CANDIDATURES: (id) => `/mes-annonces/${id}/candidatures`,

  // Locataire
  MES_FAVORIS:        '/mes-favoris',
  MES_RECHERCHES:     '/mes-recherches',
  MES_CANDIDATURES:   '/mes-candidatures',
  CANDIDATURE:        (id) => `/candidatures/${id}`,

  // Messagerie & notifications
  MESSAGERIE:         '/messagerie',
  CONVERSATION:       (id) => `/messagerie/${id}`,
  NOTIFICATIONS:      '/notifications',
  NOTIFICATION_PREFERENCES: '/profil/notifications',

  // Admin
  ADMIN:                    '/admin',
  ADMIN_MODERATION:         '/admin/moderation',
  ADMIN_UTILISATEURS:       '/admin/utilisateurs',
  ADMIN_UTILISATEUR:        (id) => `/admin/utilisateurs/${id}`,
  ADMIN_SIGNALEMENTS:       '/admin/signalements',
  ADMIN_CATEGORIES:         '/admin/categories',
  ADMIN_JOURNAL:            '/admin/journal',
  ADMIN_QUARTIERS:          '/admin/quartiers',
  ADMIN_STATISTIQUES:       '/admin/statistiques',
  ADMIN_EXPORTS:            '/admin/exports',

  // Score de quartier
  SCORE_QUARTIER:     '/score-quartier',
  PROFIL_CONTRIBUTEUR: '/mon-profil-contributeur',
};

export const API_ROUTES = {
  // Auth
  AUTH_REGISTER:        '/api/auth/register',
  AUTH_LOGIN:           '/api/auth/login',
  AUTH_LOGOUT:          '/api/auth/logout',
  AUTH_ME:              '/api/auth/me',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD:  '/api/auth/reset-password',
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
  PROPERTY_SUBMIT:          (id) => `/api/properties/${id}/submit`,
  PROPERTY_ARCHIVE:         (id) => `/api/properties/${id}/archive`,
  PROPERTY_IMAGES:          (id) => `/api/properties/${id}/images`,
  PROPERTY_IMAGE:           (id, imgId) => `/api/properties/${id}/images/${imgId}`,
  PROPERTY_IMAGES_REORDER:  (id) => `/api/properties/${id}/images/reorder`,
  PROPERTY_IMAGE_PRIMARY:   (id, imgId) => `/api/properties/${id}/images/${imgId}/primary`,
  MY_PROPERTIES:            '/api/my-properties',
  ADMIN_PROPERTIES_PENDING: '/api/admin/properties',
  ADMIN_PROPERTY_MODERATE:  (id) => `/api/admin/properties/${id}/moderate`,
  // Favorites
  FAVORITES:                '/api/favorites',
  FAVORITE_TOGGLE:          (id) => `/api/favorites/${id}`,
  FAVORITE_CHECK:           (id) => `/api/favorites/${id}/check`,
  // Score de quartier (Phase 8)
  NEIGHBORHOOD_SCORE:           '/api/neighborhood/score',
  NEIGHBORHOOD_HISTORY:         '/api/neighborhood/history',
  NEIGHBORHOOD_PROPERTY_SCORE:   (propertyId) => `/api/neighborhood/property/${propertyId}`,
  NEIGHBORHOOD_PROPERTY_REVIEWS: (propertyId) => `/api/neighborhood/property/${propertyId}/reviews`,
  NEIGHBORHOOD_SUBMIT:          '/api/neighborhood/report',
  NEIGHBORHOOD_MY_REPORTS:      '/api/neighborhood/my-reports',
  NEIGHBORHOOD_MY_PROFILE:      '/api/neighborhood/my-profile',
  ADMIN_NEIGHBORHOOD_REPORTS:   '/api/admin/neighborhood/reports',
  ADMIN_NEIGHBORHOOD_FLAG:      (id) => `/api/admin/neighborhood/reports/${id}/flag`,
  ADMIN_NEIGHBORHOOD_VALIDATE:  (id) => `/api/admin/neighborhood/reports/${id}/validate`,
  ADMIN_NEIGHBORHOOD_RECOMPUTE: '/api/admin/neighborhood/recompute',
  // Administration (Phase 7)
  ADMIN_DASHBOARD:          '/api/admin/dashboard',
  ADMIN_USERS:              '/api/admin/users',
  ADMIN_USER:               (id) => `/api/admin/users/${id}`,
  ADMIN_USER_SUSPEND:       (id) => `/api/admin/users/${id}/suspend`,
  ADMIN_USER_ACTIVATE:      (id) => `/api/admin/users/${id}/activate`,
  ADMIN_USER_DELETE:        (id) => `/api/admin/users/${id}`,
  ADMIN_USER_RESTORE:       (id) => `/api/admin/users/${id}/restore`,
  ADMIN_REPORTS:            '/api/admin/reports',
  ADMIN_REPORT:             (id) => `/api/admin/reports/${id}`,
  ADMIN_REPORT_HANDLE:      (id) => `/api/admin/reports/${id}/handle`,
  REPORT_PROPERTY:          (propertyId) => `/api/reports/properties/${propertyId}`,
  REPORT_MESSAGE:           (messageId) => `/api/reports/messages/${messageId}`,
  ADMIN_AMENITY_CATEGORIES: '/api/admin/amenity-categories',
  ADMIN_AMENITY_CATEGORY:   (id) => `/api/admin/amenity-categories/${id}`,
  ADMIN_LOGS:               '/api/admin/logs',
  REFERENCE_AMENITIES:      '/api/reference/amenities',
  REFERENCE_PROPERTY_TYPES: '/api/reference/property-types',
  REFERENCE_CHARGES:        '/api/reference/charges',
  // Notifications (Phase 6)
  NOTIFICATIONS:              '/api/notifications',
  NOTIFICATION_UNREAD_COUNT:  '/api/notifications/unread-count',
  NOTIFICATION_MARK_ALL_READ: '/api/notifications/mark-all-read',
  NOTIFICATION_MARK_READ:     (id) => `/api/notifications/${id}/read`,
  NOTIFICATION_DELETE:        (id) => `/api/notifications/${id}`,
  NOTIFICATION_PREFERENCES:   '/api/notification-preferences',
  // Messaging (Phase 5)
  CONVERSATIONS:               '/api/conversations',
  CONVERSATION:                (id) => `/api/conversations/${id}`,
  CONVERSATION_START:          (propertyId) => `/api/conversations/properties/${propertyId}`,
  CONVERSATION_MARK_READ:      (id) => `/api/conversations/${id}/read`,
  CONVERSATION_ARCHIVE:        (id) => `/api/conversations/${id}/archive`,
  CONVERSATION_UNARCHIVE:      (id) => `/api/conversations/${id}/unarchive`,
  CONVERSATION_MESSAGES:       (id) => `/api/conversations/${id}/messages`,
  CONVERSATION_MESSAGES_SINCE: (id) => `/api/conversations/${id}/messages/since`,
  MESSAGING_UNREAD_COUNT:      '/api/messaging/unread-count',
  // Rental requests (Phase 4)
  RENTAL_REQUESTS:              '/api/rental-requests',
  RENTAL_REQUEST:               (id) => `/api/rental-requests/${id}`,
  RENTAL_REQUEST_STORE:         (propertyId) => `/api/rental-requests/properties/${propertyId}`,
  RENTAL_REQUEST_DECIDE:        (id) => `/api/rental-requests/${id}/decide`,
  RENTAL_REQUEST_CANCEL:        (id) => `/api/rental-requests/${id}/cancel`,
  RENTAL_REQUEST_SCHEDULE:      (id) => `/api/rental-requests/${id}/schedule-visit`,
  RENTAL_REQUEST_CONFIRM_VISIT: (id) => `/api/rental-requests/${id}/confirm-visit`,
  RENTAL_REQUEST_DOCUMENTS:     (id) => `/api/rental-requests/${id}/documents`,
  RENTAL_REQUEST_DOCUMENT:      (id, docId) => `/api/rental-requests/${id}/documents/${docId}`,
  DOCUMENT_DOWNLOAD:            (docId) => `/api/documents/${docId}/download`,
  DOCUMENT_VERIFY:              (docId) => `/api/documents/${docId}/verify`,
  // Statistiques & Exports (Phase 9)
  STATISTICS_PROPERTY:      (propertyId) => `/api/statistics/property/${propertyId}`,
  STATISTICS_OWNER:         '/api/statistics/owner-dashboard',
  STATISTICS_TENANT:        '/api/statistics/tenant-dashboard',
  ADMIN_STATS_ADVANCED:     '/api/admin/statistics/advanced',
  ADMIN_STATS_TIMELINE:     '/api/admin/statistics/views-timeline',
  ADMIN_STATS_TOP:          '/api/admin/statistics/top-properties',
  PROPERTIES_POPULAR:       '/api/properties/popular',
  EXPORT_PROPERTIES:        '/api/admin/export/properties',
  EXPORT_USERS:             '/api/admin/export/users',
  EXPORT_RENTAL_REQUESTS:   '/api/admin/export/rental-requests',
  EXPORT_ACTIVITY_REPORT:   '/api/admin/export/activity-report',
  EXPORT_PROPERTY_REPORT:   (propertyId) => `/api/admin/export/property-report/${propertyId}`,
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
  { value: 'draft',            label: 'Brouillon',        color: 'gray'   },
  { value: 'active',           label: 'Disponible',       color: 'green'  },
  { value: 'archived',         label: 'Archivé',          color: 'gray'   },
  { value: 'sous_reservation', label: 'Sous réservation', color: 'orange' },
  { value: 'loue',             label: 'Loué',             color: 'blue'   },
];

// Statuts que le propriétaire peut définir manuellement (via PATCH /status)
// Transitions : active → sous_reservation | loue | archived
//               sous_reservation → active | loue | archived
//               loue → active | archived
export const OWNER_SETTABLE_STATUSES = PROPERTY_STATUSES.filter(
  (s) => ['active', 'archived', 'sous_reservation', 'loue'].includes(s.value)
);

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

// ─── Phase 4 — Demandes de Location ──────────────────────────────────────────

export const ROUTES_LOCATAIRE = {
  MES_CANDIDATURES: '/mes-candidatures',
  CANDIDATURE:      (id) => `/candidatures/${id}`,
};

export const ROUTES_PROPRIETAIRE = {
  PROPERTY_CANDIDATURES: (id) => `/mes-annonces/${id}/candidatures`,
};

export const DOCUMENT_TYPES = [
  { value: 'cni',                  label: "Carte Nationale d'Identité" },
  { value: 'passeport',            label: 'Passeport' },
  { value: 'certificat_residence', label: 'Certificat de résidence' },
  { value: 'bulletin_salaire',     label: 'Bulletin de salaire' },
  { value: 'attestation_travail',  label: 'Attestation de travail' },
  { value: 'releve_bancaire',      label: 'Relevé bancaire' },
  { value: 'garant_cni',           label: 'CNI du garant' },
  { value: 'garant_salaire',       label: 'Bulletin de salaire du garant' },
  { value: 'autre',                label: 'Autre document' },
];

export const REQUIRED_DOCUMENT_TYPES = ['cni', 'bulletin_salaire'];

// ─── Phase 8 — Score de Quartier & Gamification ─────────────────────────────

export const NEIGHBORHOOD_CRITERIA = [
  { value: 'eau',         label: 'Eau courante',  icon: '💧', description: "Accès et régularité de l'eau" },
  { value: 'electricite', label: 'Électricité',   icon: '⚡', description: 'Fiabilité du réseau électrique' },
  { value: 'securite',    label: 'Sécurité',      icon: '🛡️', description: 'Sécurité du quartier' },
  { value: 'transport',   label: 'Transport',     icon: '🚌', description: 'Accès aux transports en commun' },
  { value: 'commerces',   label: 'Commerces',     icon: '🛒', description: 'Proximité des marchés et boutiques' },
  { value: 'routes',      label: 'Routes',        icon: '🛣️', description: "État des voies d'accès" },
  { value: 'sante',       label: 'Santé',         icon: '🏥', description: 'Proximité des structures de santé' },
  { value: 'education',   label: 'Éducation',     icon: '🏫', description: 'Proximité des écoles et universités' },
];

export const CONTRIBUTOR_BADGES = {
  premier_signalement: { label: 'Premier signalement',  icon: '🏅', description: '1er rapport soumis' },
  contributeur_actif:  { label: 'Contributeur actif',   icon: '⭐', description: '10 rapports validés' },
  expert_quartier:     { label: 'Expert quartier',      icon: '🏆', description: '50 rapports validés' },
  explorateur:         { label: 'Explorateur',          icon: '🗺️', description: '3 quartiers différents évalués' },
  fiable:              { label: 'Contributeur fiable',  icon: '✅', description: 'Aucun rapport suspect' },
};

export const SCORE_COLORS = {
  excellent: { min: 4.0, label: 'Excellent',  color: 'green',  hex: '#22c55e' },
  bien:      { min: 3.0, label: 'Bien',       color: 'lime',   hex: '#84cc16' },
  moyen:     { min: 2.0, label: 'Moyen',      color: 'yellow', hex: '#eab308' },
  mauvais:   { min: 1.0, label: 'Mauvais',    color: 'red',    hex: '#ef4444' },
};

export const getScoreColor = (score) => {
  if (!score) return 'gray';
  if (score >= 4.0) return 'green';
  if (score >= 3.0) return 'lime';
  if (score >= 2.0) return 'yellow';
  return 'red';
};

export const getScoreLabel = (score) => {
  if (!score) return 'Non évalué';
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Bien';
  if (score >= 2.5) return 'Moyen';
  if (score >= 1.5) return 'Mauvais';
  return 'Très mauvais';
};

// ─── Phase 7 — Administration ────────────────────────────────────────────────

export const REPORT_REASONS = [
  { value: 'contenu_inapproprie',  label: 'Contenu inapproprié' },
  { value: 'arnaque_suspectee',    label: 'Arnaque suspectée' },
  { value: 'informations_fausses', label: 'Informations fausses' },
  { value: 'photos_trompeuses',    label: 'Photos trompeuses' },
  { value: 'prix_abusif',          label: 'Prix abusif' },
  { value: 'annonce_inexistante',  label: 'Annonce inexistante' },
  { value: 'comportement_abusif',  label: 'Comportement abusif' },
  { value: 'autre',                label: 'Autre' },
];

export const REPORT_STATUSES = [
  { value: 'en_attente', label: 'En attente', color: 'yellow' },
  { value: 'en_cours',   label: 'En cours',   color: 'blue'   },
  { value: 'resolu',     label: 'Résolu',     color: 'green'  },
  { value: 'rejete',     label: 'Rejeté',     color: 'gray'   },
];

export const REPORT_HANDLE_ACTIONS = [
  { value: 'resolve',     label: 'Résoudre' },
  { value: 'reject',      label: 'Rejeter' },
  { value: 'in_progress', label: 'Marquer en cours' },
];

// ─── Phase 6 — Notifications ─────────────────────────────────────────────────

export const NOTIFICATION_POLL_INTERVAL = 30000;

export const NOTIFICATION_TYPES = {
  RENTAL_REQUEST_RECEIVED: 'rental_request_received',
  RENTAL_REQUEST_ACCEPTED: 'rental_request_accepted',
  RENTAL_REQUEST_REFUSED:  'rental_request_refused',
  MESSAGE_RECEIVED:        'message_received',
  PROPERTY_APPROVED:       'property_approved',
  PROPERTY_REJECTED:       'property_rejected',
  VISIT_SCHEDULED:         'visit_scheduled',
  SAVED_SEARCH_MATCH:      'saved_search_match',
};

export const NOTIFICATION_TYPE_LABELS = {
  rental_request_received: 'Demande de location reçue',
  rental_request_accepted: 'Demande acceptée',
  rental_request_refused:  'Demande refusée',
  message_received:        'Nouveau message',
  property_approved:       'Annonce approuvée',
  property_rejected:       'Annonce refusée',
  visit_scheduled:         'Visite planifiée',
  saved_search_match:      'Nouvelle annonce correspondante',
};

// ─── Phase 5 — Messagerie ────────────────────────────────────────────────────

export const MESSAGING_POLL_INTERVAL = 5000;
export const MESSAGE_ATTACHMENT_MAX_SIZE = 5 * 1024 * 1024;
export const MESSAGE_ATTACHMENT_MAX_COUNT = 3;
export const MESSAGE_ATTACHMENT_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
];

// ─── Phase 9 — Statistiques & Exports ───────────────────────────────────────

export const STAT_PERIODS = [
  { value: '7days',  label: '7 derniers jours' },
  { value: '30days', label: '30 derniers jours' },
  { value: '90days', label: '3 derniers mois' },
  { value: '1year',  label: '12 derniers mois' },
];

export const TOP_METRICS = [
  { value: 'views_count',     label: 'Plus vues' },
  { value: 'favorites_count', label: 'Plus en favoris' },
  { value: 'requests_count',  label: 'Plus demandées' },
];

export const RENTAL_REQUEST_STATUSES = [
  { value: 'en_attente', label: 'En attente', color: 'yellow' },
  { value: 'acceptee',   label: 'Acceptée',   color: 'green'  },
  { value: 'refusee',    label: 'Refusée',    color: 'red'    },
  { value: 'annulee',    label: 'Annulée',    color: 'gray'   },
  { value: 'terminee',   label: 'Terminée',   color: 'blue'   },
];
