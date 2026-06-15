import { http, HttpResponse } from 'msw';

const API = 'http://localhost:8000';

export const mockUser = {
  id: 1,
  name: 'Jean Dupont',
  email: 'jean@test.cm',
  role: 'locataire',
  phone: '+237655123456',
  city: 'Yaoundé',
  bio: null,
  avatar_url: null,
  avatar_thumb_url: null,
  is_active: true,
  email_verified_at: '2026-01-01T00:00:00.000000Z',
  created_at: '2026-01-01T00:00:00.000000Z',
};

export const mockProprietaire = {
  ...mockUser,
  id: 2,
  name: 'Marie Propriétaire',
  email: 'marie@test.cm',
  role: 'proprietaire',
};

export const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.test_token';

export const mockProperty = {
  id: 1,
  title: 'Appartement moderne Bastos',
  description: 'Bel appartement bien situé au quartier Bastos.',
  type: 'appartement',
  status: 'active',
  is_approved: true,
  rejection_reason: null,
  price: 150000,
  surface: 80,
  rooms: 3,
  floor: 2,
  deposit_amount: 300000,
  address: '12 rue du Général',
  city: 'Yaoundé',
  neighborhood: 'Bastos',
  latitude: '3.8664',
  longitude: '11.5167',
  available_from: '2026-06-01',
  amenities: ['wifi', 'parking'],
  charges_included: ['eau'],
  accepts_animals: false,
  accepts_smokers: false,
  accepts_students: true,
  views_count: 42,
  owner: {
    id: 2,
    name: 'Marie Propriétaire',
    email: 'marie@test.cm',
    phone: '+237699000000',
  },
  images: [
    {
      id: 1,
      original_url: `${API}/storage/properties/1/img1.jpg`,
      optimized_url: `${API}/storage/properties/1/opt_img1.webp`,
      thumbnail_url: `${API}/storage/properties/1/thumb_img1.webp`,
      original_name: 'img1.jpg',
      is_primary: true,
      order: 0,
    },
    {
      id: 2,
      original_url: `${API}/storage/properties/1/img2.jpg`,
      optimized_url: `${API}/storage/properties/1/opt_img2.webp`,
      thumbnail_url: `${API}/storage/properties/1/thumb_img2.webp`,
      original_name: 'img2.jpg',
      is_primary: false,
      order: 1,
    },
  ],
  created_at: '2026-05-01T10:00:00.000000Z',
  updated_at: '2026-05-01T10:00:00.000000Z',
};

export const mockPendingProperty = {
  ...mockProperty,
  id: 3,
  title: 'Studio centre-ville',
  is_approved: false,
  status: 'pending',
};

export const mockNotification = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  type: 'rental_request_received',
  title: 'Nouvelle demande de location',
  body: 'Jean Locataire souhaite louer votre bien "Appartement 3 pièces Bastos".',
  data: {
    type: 'rental_request_received',
    title: 'Nouvelle demande de location',
    body: 'Jean Locataire souhaite louer votre bien "Appartement 3 pièces Bastos".',
    rental_request_id: 1,
    property_id: 1,
    tenant_id: 3,
    action_url: '/rental-requests/1',
  },
  is_read: false,
  read_at: null,
  created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
};

export const mockNotificationRead = {
  ...mockNotification,
  id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  is_read: true,
  read_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
};

export const mockNotificationPreferences = {
  channels: { mail: true, database: true },
  enabled_types: {},
  available_types: [
    'rental_request_received', 'rental_request_accepted',
    'rental_request_refused', 'message_received',
    'property_approved', 'property_rejected',
    'visit_scheduled', 'saved_search_match',
  ],
};

export const mockConversation = {
  id: 1,
  subject: null,
  last_message_preview: 'Bonjour, ce logement est-il toujours disponible ?',
  last_message_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  is_archived: false,
  created_at: '2026-02-10T10:00:00.000000Z',
  unread_count: 2,
  property: {
    id: 1,
    title: 'Appartement 3 pièces Bastos',
    city: 'Yaoundé',
    thumbnail_url: null,
  },
  other_participant: {
    id: 2,
    name: 'Marie Propriétaire',
    avatar_thumb_url: null,
    role: 'proprietaire',
  },
};

export const mockMessage = {
  id: 1,
  body: 'Bonjour, ce logement est-il toujours disponible ?',
  type: 'text',
  is_mine: true,
  created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  sender: {
    id: 3,
    name: 'Paul Locataire',
    avatar_thumb_url: null,
    role: 'locataire',
  },
  attachments: [],
};

export const mockMessageOwner = {
  ...mockMessage,
  id: 2,
  body: 'Oui, le logement est disponible ! Voulez-vous visiter ?',
  is_mine: false,
  sender: {
    id: 2,
    name: 'Marie Propriétaire',
    avatar_thumb_url: null,
    role: 'proprietaire',
  },
};

export const mockRentalRequest = {
  id: 1,
  status: 'en_attente',
  message: 'Bonjour, je suis très intéressé par ce logement.',
  owner_response: null,
  decided_at: null,
  visit_scheduled_at: null,
  visit_confirmed: false,
  dossier_complete: false,
  documents_count: 0,
  created_at: '2026-02-01T10:00:00.000000Z',
  updated_at: '2026-02-01T10:00:00.000000Z',
  property: {
    id: 1,
    title: 'Appartement 3 pièces Bastos',
    type: 'appartement',
    price: '150000.00',
    city: 'Yaoundé',
    status: 'active',
    primary_image: null,
  },
  tenant: {
    id: 3,
    name: 'Paul Locataire',
    avatar_thumb_url: null,
  },
  documents: [],
};

export const mockRentalDocument = {
  id: 1,
  type: 'cni',
  original_name: 'CNI_Paul.pdf',
  mime_type: 'application/pdf',
  file_size: 512000,
  description: null,
  is_verified: false,
  verified_at: null,
  created_at: '2026-02-02T10:00:00.000000Z',
};

export const mockSavedSearch = {
  id: 1,
  name: 'Studio Bastos',
  criteria: {
    city: 'Yaoundé',
    type: 'studio',
    price_max: 100000,
  },
  notifications_enabled: true,
  last_notified_at: null,
  created_at: '2026-01-15T10:00:00.000000Z',
};

export const mockPaginatedProperties = {
  data: [mockProperty],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 1,
  },
};

export const handlers = [

  /* ─── Sanctum CSRF ─── */
  http.get(`${API}/sanctum/csrf-cookie`, () => new HttpResponse(null, { status: 204 })),

  /* ─── Auth ─── */

  http.post(`${API}/api/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'jean@test.cm' && body.password === 'Password1') {
      return HttpResponse.json({ token: mockToken, token_type: 'Bearer', user: mockUser }, { status: 200 });
    }
    if (body.email === 'suspended@test.cm') {
      return HttpResponse.json(
        { message: "Votre compte a été suspendu. Contactez l'administration.", code: 'ACCOUNT_SUSPENDED' },
        { status: 403 }
      );
    }
    return HttpResponse.json(
      { message: 'Identifiants incorrects.', code: 'UNAUTHENTICATED' },
      { status: 401 }
    );
  }),

  http.post(`${API}/api/auth/register`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'existe@test.cm') {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { email: ['Cette adresse email est déjà utilisée.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({
      token: mockToken,
      token_type: 'Bearer',
      user: { ...mockUser, email: body.email, role: body.role },
    }, { status: 201 });
  }),

  http.post(`${API}/api/auth/logout`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API}/api/auth/me`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Non authentifié.', code: 'UNAUTHENTICATED' }, { status: 401 });
    }
    return HttpResponse.json({ data: mockUser }, { status: 200 });
  }),

  http.post(`${API}/api/auth/forgot-password`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'inexistant@test.cm') {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { email: ["Aucun compte n'est associé à cet email."] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({ message: 'Lien de réinitialisation envoyé par email.' }, { status: 200 });
  }),

  http.post(`${API}/api/auth/reset-password`, async ({ request }) => {
    const body = await request.json();
    if (body.token === 'invalid_token') {
      return HttpResponse.json(
        { message: 'Token invalide ou expiré.', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
  }),

  /* ─── Profile ─── */

  http.get(`${API}/api/user/profile`, () => HttpResponse.json({ data: mockUser }, { status: 200 })),

  http.put(`${API}/api/user/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { ...mockUser, ...body } }, { status: 200 });
  }),

  http.post(`${API}/api/user/avatar`, () => HttpResponse.json({
    data: {
      ...mockUser,
      avatar_url: `${API}/storage/avatars/1/profile_123.webp`,
      avatar_thumb_url: `${API}/storage/avatars/1/thumb_123.webp`,
    }
  }, { status: 200 })),

  http.put(`${API}/api/user/password`, async ({ request }) => {
    const body = await request.json();
    if (body.current_password === 'wrong_password') {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { current_password: ['Le mot de passe actuel est incorrect.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({ message: 'Mot de passe modifié avec succès.' }, { status: 200 });
  }),

  /* ─── Properties ─── */

  // Popular properties must come before the generic /:id handler (MSW order matters)
  http.get(`${API}/api/properties/popular`, () =>
    HttpResponse.json({
      data: [mockProperty, { ...mockProperty, id: 2, title: 'Studio Mvan', views_count: 87 }]
    }, { status: 200 })
  ),

  http.get(`${API}/api/properties`, ({ request }) => {
    const url = new URL(request.url);
    const priceMin = url.searchParams.get('price_min');
    const priceMax = url.searchParams.get('price_max');
    if (priceMin && priceMax && Number(priceMax) < Number(priceMin)) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { price_max: ['Le prix maximum doit être supérieur au prix minimum.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json(mockPaginatedProperties, { status: 200 });
  }),

  http.get(`${API}/api/properties/map`, () =>
    HttpResponse.json({
      data: [{
        id: 1,
        latitude: '3.8667',
        longitude: '11.5167',
        price: '150000.00',
        price_formatted: '150 000 FCFA/mois',
        type: 'appartement',
        status: 'active',
        thumbnail_url: `${API}/storage/properties/1/thumbnails/img_1.webp`,
      }],
    }, { status: 200 })
  ),

  http.get(`${API}/api/properties/:id`, ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Bien introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({ ...mockProperty, id: parseInt(params.id) }, { status: 200 });
  }),

  http.post(`${API}/api/properties`, async ({ request }) => {
    const body = await request.json();
    if (!body.title) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { title: ['Le titre est obligatoire.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({ ...mockProperty, title: body.title }, { status: 201 });
  }),

  http.put(`${API}/api/properties/:id`, async ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Bien introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({ ...mockProperty, id: parseInt(params.id) }, { status: 200 });
  }),

  http.delete(`${API}/api/properties/:id`, ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Bien introuvable.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API}/api/properties/:id/status`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { ...mockProperty, id: parseInt(params.id), status: body.status },
      { status: 200 }
    );
  }),

  http.post(`${API}/api/properties/:id/submit`, ({ params }) =>
    HttpResponse.json({ ...mockProperty, id: parseInt(params.id), status: 'pending' }, { status: 200 })
  ),

  http.post(`${API}/api/properties/:id/archive`, ({ params }) =>
    HttpResponse.json({ ...mockProperty, id: parseInt(params.id), status: 'archived' }, { status: 200 })
  ),

  /* ─── My Properties ─── */

  http.get(`${API}/api/my-properties`, () =>
    HttpResponse.json({ ...mockPaginatedProperties, data: [{ ...mockProperty }] }, { status: 200 })
  ),

  /* ─── Property Images ─── */

  http.post(`${API}/api/properties/:id/images`, () =>
    HttpResponse.json(mockProperty.images[0] ?? {}, { status: 201 })
  ),

  http.delete(`${API}/api/properties/:propertyId/images/:imageId`, ({ params }) => {
    if (params.imageId === '999') {
      return HttpResponse.json({ message: 'Image introuvable.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${API}/api/properties/:id/images/reorder`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.patch(`${API}/api/properties/:propertyId/images/:imageId/primary`, () =>
    HttpResponse.json(mockProperty.images[0] ?? {}, { status: 200 })
  ),

  /* ─── Admin ─── */

  http.get(`${API}/api/admin/properties`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const data = status === 'pending' ? [mockPendingProperty] : [mockProperty, mockPendingProperty];
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, per_page: 15, total: data.length },
    }, { status: 200 });
  }),

  http.post(`${API}/api/admin/properties/:id/moderate`, async ({ params, request }) => {
    const body = await request.json();
    if (body.action === 'reject' && !body.rejection_reason) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { rejection_reason: ['La raison du rejet est obligatoire.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    const isApproved = body.action === 'approve';
    return HttpResponse.json({
      ...mockPendingProperty,
      id: parseInt(params.id),
      status: isApproved ? 'active' : 'rejected',
      is_approved: isApproved,
      rejection_reason: body.rejection_reason ?? null,
    }, { status: 200 });
  }),

  /* ─── Favorites ─── */

  http.get(`${API}/api/favorites`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json(mockPaginatedProperties, { status: 200 });
  }),

  http.post(`${API}/api/favorites/:id`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      message: 'Ajouté aux favoris.',
      is_favorited: true,
      favorites_count: 6,
    }, { status: 200 });
  }),

  http.get(`${API}/api/favorites/:id/check`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ is_favorited: false, favorites_count: 5 }, { status: 200 });
  }),

  /* ─── Saved Searches ─── */

  http.get(`${API}/api/saved-searches`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: [mockSavedSearch] }, { status: 200 });
  }),

  http.post(`${API}/api/saved-searches`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body.name === 'LIMIT_TEST' || body._simulateLimit) {
      return HttpResponse.json({
        message: 'Vous ne pouvez pas sauvegarder plus de 10 recherches.',
        code: 'SAVED_SEARCH_LIMIT_REACHED',
      }, { status: 422 });
    }
    return HttpResponse.json({
      data: { ...mockSavedSearch, id: 99, name: body.name, criteria: body.criteria }
    }, { status: 201 });
  }),

  http.put(`${API}/api/saved-searches/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { ...mockSavedSearch, ...body } }, { status: 200 });
  }),

  http.delete(`${API}/api/saved-searches/:id`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.patch(`${API}/api/saved-searches/:id/toggle-notifications`, () =>
    HttpResponse.json({
      message: 'Notifications désactivées.',
      notifications_enabled: false,
    }, { status: 200 })
  ),

  http.get(`${API}/api/saved-searches/:id/results`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json(mockPaginatedProperties, { status: 200 });
  }),

  /* ─── Rental Requests (Phase 4) ─── */

  http.get(`${API}/api/rental-requests`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockRentalRequest],
      meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
    }, { status: 200 });
  }),

  http.get(`${API}/api/rental-requests/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Ressource introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({
      data: { ...mockRentalRequest, documents: [mockRentalDocument] }
    }, { status: 200 });
  }),

  http.post(`${API}/api/rental-requests/properties/:propertyId`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body._simulateDouble) {
      return HttpResponse.json({
        message: 'Vous avez déjà une demande en cours pour ce bien.',
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    if (body._simulateUnavailable) {
      return HttpResponse.json({
        message: "Ce bien n'est pas disponible à la location.",
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({ data: mockRentalRequest }, { status: 201 });
  }),

  http.post(`${API}/api/rental-requests/:id/decide`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body.action === 'refuse' && !body.owner_response) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { owner_response: ['Un motif est obligatoire en cas de refus.'] },
      }, { status: 422 });
    }
    const status = body.action === 'accept' ? 'acceptee' : 'refusee';
    return HttpResponse.json({
      message: body.action === 'accept'
        ? 'Demande acceptée. Les autres candidatures ont été refusées.'
        : 'Demande refusée.',
      data: { ...mockRentalRequest, status, decided_at: new Date().toISOString() },
    }, { status: 200 });
  }),

  http.post(`${API}/api/rental-requests/:id/cancel`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Demande annulée.' }, { status: 200 });
  }),

  http.post(`${API}/api/rental-requests/:id/schedule-visit`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Visite planifiée.' }, { status: 200 });
  }),

  http.post(`${API}/api/rental-requests/:id/confirm-visit`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Visite confirmée.' }, { status: 200 });
  }),

  http.post(`${API}/api/rental-requests/:id/documents`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockRentalDocument }, { status: 201 });
  }),

  http.delete(`${API}/api/rental-requests/:id/documents/:docId`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/api/documents/:docId/download`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      download_url: `${API}/storage/documents/test.pdf?signature=abc123&expires=9999999999`,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    }, { status: 200 });
  }),

  http.post(`${API}/api/documents/:docId/verify`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: { ...mockRentalDocument, is_verified: true, verified_at: new Date().toISOString() }
    }, { status: 200 });
  }),

  /* ─── Messaging (Phase 5) ─── */

  http.get(`${API}/api/messaging/unread-count`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ unread_count: 3 }, { status: 200 });
  }),

  http.get(`${API}/api/conversations`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockConversation],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 1 },
    }, { status: 200 });
  }),

  http.get(`${API}/api/conversations/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Ressource introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({
      conversation: { ...mockConversation, unread_count: 0 },
      messages: {
        data: [mockMessage, mockMessageOwner],
        meta: { current_page: 1, last_page: 1, per_page: 30, total: 2 },
      },
    }, { status: 200 });
  }),

  http.post(`${API}/api/conversations/properties/:propertyId`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (!body.initial_message || body.initial_message.length < 5) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { initial_message: ['Le message initial est obligatoire.'] },
      }, { status: 422 });
    }
    return HttpResponse.json({ data: { ...mockConversation, id: 10 } }, { status: 201 });
  }),

  http.post(`${API}/api/conversations/:id/read`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Messages marqués comme lus.', unread_count: 0 }, { status: 200 });
  }),

  http.post(`${API}/api/conversations/:id/archive`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Conversation archivée.' }, { status: 200 });
  }),

  http.post(`${API}/api/conversations/:id/unarchive`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Conversation restaurée.' }, { status: 200 });
  }),

  http.get(`${API}/api/conversations/:id/messages`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockMessage, mockMessageOwner],
      meta: { current_page: 1, last_page: 1, per_page: 30, total: 2 },
    }, { status: 200 });
  }),

  http.post(`${API}/api/conversations/:id/messages`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    let body = '';
    try {
      const json = await request.json();
      body = json.body;
    } catch {
      body = 'Message test';
    }
    if (!body || body.trim() === '') {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { body: ['Le message ne peut pas être vide.'] },
      }, { status: 422 });
    }
    return HttpResponse.json({
      data: { ...mockMessage, id: Date.now(), body, created_at: new Date().toISOString() }
    }, { status: 201 });
  }),

  http.get(`${API}/api/conversations/:id/messages/since`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: [] }, { status: 200 });
  }),

  /* ─── Notifications (Phase 6) ─── */

  http.get(`${API}/api/notifications`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const url = new URL(request.url);
    const unread = url.searchParams.get('unread') === 'true';
    const data = unread ? [mockNotification] : [mockNotification, mockNotificationRead];
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: data.length },
    }, { status: 200 });
  }),

  http.get(`${API}/api/notifications/unread-count`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ count: 3 }, { status: 200 });
  }),

  http.post(`${API}/api/notifications/mark-all-read`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      message: 'Toutes les notifications marquées comme lues.',
      count: 0,
    }, { status: 200 });
  }),

  http.post(`${API}/api/notifications/:id/read`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    if (params.id === '00000000-0000-0000-0000-000000000000') {
      return HttpResponse.json({ message: 'Ressource introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({
      message: 'Notification marquée comme lue.',
      data: { ...mockNotification, id: params.id, is_read: true, read_at: new Date().toISOString() },
    }, { status: 200 });
  }),

  http.delete(`${API}/api/notifications/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    if (params.id === '00000000-0000-0000-0000-000000000000') {
      return HttpResponse.json({ message: 'Ressource introuvable.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/api/notification-preferences`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json(mockNotificationPreferences, { status: 200 });
  }),

  http.put(`${API}/api/notification-preferences`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    const merged = {
      ...mockNotificationPreferences,
      channels: { ...mockNotificationPreferences.channels, ...(body.channels || {}) },
      enabled_types: { ...mockNotificationPreferences.enabled_types, ...(body.enabled_types || {}) },
    };
    return HttpResponse.json({
      message: 'Préférences mises à jour.',
      channels: merged.channels,
      enabled_types: merged.enabled_types,
    }, { status: 200 });
  }),

  /* ─── Administration (Phase 7) ─── */

  // Mock data
];

export const mockNeighborhoodScore = {
  latitude:     3.8667,
  longitude:    11.5167,
  radius_km:    2.0,
  global_score: 3.2,
  report_count: 18,
  criteria: {
    eau:         { score: 2.8, label: 'Moyen',     color: 'yellow', report_count: 4 },
    electricite: { score: 2.1, label: 'Mauvais',   color: 'orange', report_count: 6 },
    securite:    { score: 3.8, label: 'Bien',      color: 'lime',   report_count: 3 },
    transport:   { score: 4.2, label: 'Excellent', color: 'green',  report_count: 5 },
  },
};

export const mockPropertyScore = {
  city: 'Yaoundé', neighborhood: 'Bastos',
  global_score: 3.2,
  criteria: {
    eau:         { score: 2.8, label: 'Moyen',     color: 'yellow', report_count: 4 },
    electricite: { score: 2.1, label: 'Mauvais',   color: 'orange', report_count: 6 },
    securite:    { score: 3.8, label: 'Bien',      color: 'lime',   report_count: 3 },
    transport:   { score: 4.2, label: 'Excellent', color: 'green',  report_count: 5 },
  },
  computed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockNeighborhoodHistory = [
  { month: '2025-12', average_score: 2.8, label: 'Déc 25' },
  { month: '2026-01', average_score: 3.0, label: 'Jan 26' },
  { month: '2026-02', average_score: 3.1, label: 'Fév 26' },
  { month: '2026-03', average_score: 2.9, label: 'Mar 26' },
  { month: '2026-04', average_score: null, label: 'Avr 26' },
  { month: '2026-05', average_score: 3.2, label: 'Mai 26' },
];

export const mockNeighborhoodReport = {
  id: 1,
  criterion: 'eau',
  score: 3,
  latitude: '3.8667',
  longitude: '11.5167',
  city: 'Yaoundé',
  neighborhood: 'Bastos',
  comment: "L'eau est souvent coupée le matin.",
  is_validated: true,
  created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockContributorProfile = {
  contributor_points: 25,
  reports_count: 5,
  badges: ['premier_signalement', 'fiable'],
  latest_reports: [mockNeighborhoodReport],
};

// Handlers Phase 8
handlers.push(
  http.get('http://localhost:8000/api/neighborhood/score', ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('latitude'));
    const lng = parseFloat(url.searchParams.get('longitude'));
    if (Math.abs(lat - 3.8667) > 0.5 || Math.abs(lng - 11.5167) > 0.5) {
      return HttpResponse.json({ data: null }, { status: 200 });
    }
    return HttpResponse.json({ data: mockNeighborhoodScore }, { status: 200 });
  }),

  http.get('http://localhost:8000/api/neighborhood/property/:id', ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ data: null }, { status: 200 });
    }
    return HttpResponse.json({ data: mockPropertyScore }, { status: 200 });
  }),

  http.get('http://localhost:8000/api/neighborhood/history', () =>
    HttpResponse.json({ data: mockNeighborhoodHistory }, { status: 200 })
  ),

  http.post('http://localhost:8000/api/neighborhood/report', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body._simulateSpam) {
      return HttpResponse.json({
        message: 'Vous avez déjà évalué ce critère dans cette zone ce mois-ci.',
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    if (body.score < 1 || body.score > 5) {
      return HttpResponse.json({
        errors: { score: ['La note doit être comprise entre 1 et 5.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({ data: { ...mockNeighborhoodReport, ...body } }, { status: 201 });
  }),

  http.get('http://localhost:8000/api/neighborhood/my-reports', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockNeighborhoodReport, { ...mockNeighborhoodReport, id: 2, criterion: 'securite', score: 4 }],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 2 },
    }, { status: 200 });
  }),

  http.get('http://localhost:8000/api/neighborhood/my-profile', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json(mockContributorProfile, { status: 200 });
  }),

  http.get('http://localhost:8000/api/admin/neighborhood/reports', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [
        mockNeighborhoodReport,
        { ...mockNeighborhoodReport, id: 2, is_validated: false, is_flagged: true },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 30, total: 2 },
    }, { status: 200 });
  }),

  http.post('http://localhost:8000/api/admin/neighborhood/reports/:id/flag', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Rapport signalé comme suspect.' }, { status: 200 });
  }),

  http.post('http://localhost:8000/api/admin/neighborhood/reports/:id/validate', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Rapport revalidé.' }, { status: 200 });
  }),

  http.post('http://localhost:8000/api/admin/neighborhood/recompute', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (!body.city) {
      return HttpResponse.json({
        errors: { city: ['La ville est obligatoire.'] },
      }, { status: 422 });
    }
    return HttpResponse.json({ message: 'Scores recalculés.', scores_updated: 8 }, { status: 200 });
  })
);

// ── Mock data Phase 9 ────────────────────────────────────────────────────────

export const mockPropertyStats = {
  property_id: 1,
  period: '30days',
  views: {
    total: 142,
    unique: 98,
    by_day: { '2026-04-01': 5, '2026-04-02': 8, '2026-04-03': 3 },
  },
  requests: { total: 7, en_attente: 3, acceptees: 2, refusees: 2 },
  conversion_rate: 4.93,
  favorites_count: 12,
};

export const mockOwnerDashboard = {
  owner_id: 2,
  period: '30days',
  properties: { total: 5, active: 3, pending: 1, draft: 1 },
  views_total: 289,
  requests_total: 18,
  requests_accepted: 4,
  potential_revenue: 450000,
  top_properties: [
    { id: 1, title: 'Appartement 3 pièces Bastos', views_count: 142, status: 'active' },
    { id: 2, title: 'Studio Mvan', views_count: 87, status: 'active' },
  ],
};

export const mockTenantDashboard = {
  tenant_id: 3,
  period: '30days',
  requests: { total: 4, en_attente: 1, acceptees: 2, refusees: 1, annulees: 0 },
  favorites_count: 8,
  saved_searches: 3,
  contributor_points: 25,
  badges: ['premier_signalement'],
};

export const mockAdminStats = {
  period: '30days',
  new_users_by_day: { '2026-04-01': 3, '2026-04-02': 5 },
  new_properties_by_day: { '2026-04-01': 2, '2026-04-03': 4 },
  top_cities: [
    { city: 'Yaoundé', count: 45 },
    { city: 'Douala', count: 32 },
    { city: 'Bafoussam', count: 8 },
  ],
  top_types: [
    { type: 'studio', count: 28, avg_price: 65000 },
    { type: 'appartement', count: 22, avg_price: 145000 },
    { type: 'chambre_simple', count: 18, avg_price: 35000 },
  ],
  acceptance_rate: 63.5,
  avg_price_by_city: [
    { city: 'Yaoundé', avg_price: 95000, count: 45 },
    { city: 'Douala', avg_price: 110000, count: 32 },
  ],
};

export const mockViewsTimeline = [
  { date: '2026-04-01', total_views: 15, unique_views: 12 },
  { date: '2026-04-02', total_views: 23, unique_views: 18 },
  { date: '2026-04-03', total_views: 9,  unique_views: 7  },
];

// Handlers Phase 9
handlers.push(
  http.get(`${API}/api/statistics/property/:id`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockPropertyStats }, { status: 200 });
  }),

  http.get(`${API}/api/statistics/owner-dashboard`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockOwnerDashboard }, { status: 200 });
  }),

  http.get(`${API}/api/statistics/tenant-dashboard`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockTenantDashboard }, { status: 200 });
  }),

  http.get(`${API}/api/admin/statistics/advanced`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockAdminStats }, { status: 200 });
  }),

  http.get(`${API}/api/admin/statistics/views-timeline`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockViewsTimeline }, { status: 200 });
  }),

  http.get(`${API}/api/admin/statistics/top-properties`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const url = new URL(request.url);
    const metric = url.searchParams.get('metric') || 'views_count';
    if (!['views_count', 'favorites_count', 'requests_count'].includes(metric)) {
      return HttpResponse.json({ message: 'Métrique invalide.' }, { status: 422 });
    }
    return HttpResponse.json({ data: [mockProperty] }, { status: 200 });
  }),

  http.get(`${API}/api/admin/export/property-report/:id`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return new HttpResponse(new Uint8Array([0, 1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),

  http.get(`${API}/api/admin/export/:type`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return new HttpResponse(new Uint8Array([0, 1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  })
);

export const mockAdminUser = {
  id: 10,
  name: 'Utilisateur Test',
  email: 'test@immoconnect.cm',
  role: 'locataire',
  is_active: true,
  email_verified_at: '2026-01-01T00:00:00.000000Z',
  created_at: '2026-01-15T10:00:00.000000Z',
  deleted_at: null,
  properties_count: 0,
  rental_requests_count: 3,
  avatar_url: null,
};

export const mockReport = {
  id: 1,
  reason: 'arnaque_suspectee',
  description: 'Cette annonce semble frauduleuse.',
  status: 'en_attente',
  admin_note: null,
  handled_at: null,
  created_at: '2026-03-01T10:00:00.000000Z',
  reporter: { id: 3, name: 'Paul Locataire', avatar_thumb_url: null },
  reportable_type: 'App\\Models\\Property',
  reportable_id: 1,
  reportable: { id: 1, title: 'Appartement 3 pièces Bastos', city: 'Yaoundé' },
};

export const mockAmenityCategory = {
  id: 1,
  category: 'amenity',
  value: 'internet_wifi',
  label: 'Internet / WiFi',
  is_active: true,
  sort_order: 10,
};

export const mockAdminDashboard = {
  stats: {
    total_users: 142,
    total_locataires: 98,
    total_proprietaires: 40,
    total_admins: 4,
    active_properties: 67,
    pending_properties: 8,
    pending_rental_requests: 23,
    pending_reports: 5,
    total_conversations: 89,
    total_messages: 412,
  },
  charts: {
    registrations_per_month: [
      { month: '2026-01', count: 12 },
      { month: '2026-02', count: 18 },
      { month: '2026-03', count: 9 },
    ],
    properties_per_month: [
      { month: '2026-01', submitted: 15, approved: 12, rejected: 2 },
      { month: '2026-02', submitted: 20, approved: 17, rejected: 1 },
    ],
  },
};

export const mockAdminLog = {
  id: 1,
  action: 'user.suspend',
  admin: { id: 1, name: 'Admin ImmoConnect' },
  loggable_type: 'App\\Models\\User',
  loggable_id: 10,
  before: { is_active: true },
  after: { is_active: false },
  ip_address: '127.0.0.1',
  created_at: '2026-03-10T14:30:00.000000Z',
};

// Ajouter les handlers admin au tableau principal
handlers.push(
  http.get(`${API}/api/admin/dashboard`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json(mockAdminDashboard, { status: 200 });
  }),

  http.get(`${API}/api/admin/users`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockAdminUser, { ...mockAdminUser, id: 11, role: 'proprietaire', name: 'Marie Proprio' }],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 2 },
    }, { status: 200 });
  }),

  http.get(`${API}/api/admin/users/:id`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: mockAdminUser }, { status: 200 });
  }),

  http.post(`${API}/api/admin/users/:id/suspend`, async ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (!body.reason || body.reason.length < 10) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { reason: ['Le motif doit contenir au moins 10 caractères.'] },
      }, { status: 422 });
    }
    if (params.id === '1') {
      return HttpResponse.json({ message: 'Impossible de suspendre un administrateur.' }, { status: 422 });
    }
    return HttpResponse.json({
      message: 'Utilisateur suspendu.',
      data: { ...mockAdminUser, id: Number(params.id), is_active: false },
    }, { status: 200 });
  }),

  http.post(`${API}/api/admin/users/:id/activate`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ message: 'Utilisateur réactivé.', data: { ...mockAdminUser, is_active: true } }, { status: 200 });
  }),

  http.delete(`${API}/api/admin/users/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    if (params.id === '1') {
      return HttpResponse.json({ message: 'Impossible de supprimer un administrateur.' }, { status: 422 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/api/admin/users/:id/restore`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      message: 'Compte restauré avec succès.',
      user: { ...mockAdminUser, id: Number(params.id), deleted_at: null },
    }, { status: 200 });
  }),

  http.get(`${API}/api/admin/reports`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockReport],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 1 },
    }, { status: 200 });
  }),

  http.post(`${API}/api/admin/reports/:id/handle`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (!body.admin_note || body.admin_note.length < 5) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { admin_note: ['Une note admin est obligatoire.'] },
      }, { status: 422 });
    }
    const statusMap = { resolve: 'resolu', reject: 'rejete', in_progress: 'en_cours' };
    return HttpResponse.json({
      message: 'Signalement traité.',
      data: { ...mockReport, status: statusMap[body.action] ?? 'resolu', admin_note: body.admin_note },
    }, { status: 200 });
  }),

  http.post(`${API}/api/reports/properties/:propertyId`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body._simulateDuplicate) {
      return HttpResponse.json({ message: 'Vous avez déjà signalé cet élément.' }, { status: 422 });
    }
    return HttpResponse.json({ data: { ...mockReport, reportable_type: 'App\\Models\\Property' } }, { status: 201 });
  }),

  http.post(`${API}/api/reports/messages/:messageId`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({ data: { ...mockReport, reportable_type: 'App\\Models\\Message' } }, { status: 201 });
  }),

  http.get(`${API}/api/admin/amenity-categories`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [
        mockAmenityCategory,
        { ...mockAmenityCategory, id: 2, value: 'parking', label: 'Parking', sort_order: 20 },
        { ...mockAmenityCategory, id: 3, value: 'studio', label: 'Studio', category: 'property_type' },
      ],
    }, { status: 200 });
  }),

  http.post(`${API}/api/admin/amenity-categories`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    if (body.value === 'internet_wifi') {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { value: ['Cette valeur existe déjà pour cette catégorie.'] },
      }, { status: 422 });
    }
    return HttpResponse.json({ data: { ...mockAmenityCategory, id: 99, ...body } }, { status: 201 });
  }),

  http.put(`${API}/api/admin/amenity-categories/:id`, async ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    const body = await request.json();
    return HttpResponse.json({ data: { ...mockAmenityCategory, id: Number(params.id), ...body } }, { status: 200 });
  }),

  http.delete(`${API}/api/admin/amenity-categories/:id`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/api/admin/logs`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    return HttpResponse.json({
      data: [mockAdminLog, { ...mockAdminLog, id: 2, action: 'property.approve' }],
      meta: { current_page: 1, last_page: 1, per_page: 50, total: 2 },
    }, { status: 200 });
  }),

  http.get(`${API}/api/reference/amenities`, () =>
    HttpResponse.json({ data: [{ value: 'internet_wifi', label: 'Internet / WiFi' }, { value: 'parking', label: 'Parking' }] }, { status: 200 })
  ),

  http.get(`${API}/api/reference/property-types`, () =>
    HttpResponse.json({ data: [{ value: 'studio', label: 'Studio' }, { value: 'appartement', label: 'Appartement' }] }, { status: 200 })
  ),

  http.get(`${API}/api/reference/charges`, () =>
    HttpResponse.json({ data: [{ value: 'eau', label: 'Eau' }, { value: 'electricite', label: 'Électricité' }] }, { status: 200 })
  )
);
