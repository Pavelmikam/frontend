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
  status: 'disponible',
  is_approved: true,
  rejection_reason: null,
  price: 150000,
  surface: 80,
  rooms: 3,
  floor: 2,
  deposit: 300000,
  address: '12 rue du Général',
  city: 'Yaoundé',
  neighborhood: 'Bastos',
  latitude: '3.8664',
  longitude: '11.5167',
  available_from: '2026-06-01',
  amenities: ['wifi', 'parking'],
  charges_included: ['eau'],
  allow_pets: false,
  allow_smoking: false,
  allow_children: true,
  views_count: 42,
  owner: {
    id: 2,
    first_name: 'Marie',
    last_name: 'Propriétaire',
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
  status: 'disponible',
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
    return HttpResponse.json({ data: mockProperty }, { status: 200 });
  }),

  http.post(`${API}/api/properties`, async ({ request }) => {
    const formData = await request.formData();
    if (!formData.get('title')) {
      return HttpResponse.json({
        message: 'Les données fournies sont invalides.',
        errors: { title: ['Le titre est obligatoire.'] },
        code: 'VALIDATION_ERROR',
      }, { status: 422 });
    }
    return HttpResponse.json({
      data: { ...mockProperty, title: formData.get('title') }
    }, { status: 201 });
  }),

  // Update via POST with _method=PUT (Laravel method spoofing)
  http.post(`${API}/api/properties/:id`, async ({ params, request }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Bien introuvable.' }, { status: 404 });
    }
    return HttpResponse.json({ data: { ...mockProperty, id: parseInt(params.id) } }, { status: 200 });
  }),

  http.delete(`${API}/api/properties/:id`, ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Bien introuvable.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API}/api/properties/:id/status`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { ...mockProperty, id: parseInt(params.id), status: body.status }
    }, { status: 200 });
  }),

  /* ─── My Properties ─── */

  http.get(`${API}/api/my-properties`, () =>
    HttpResponse.json({ ...mockPaginatedProperties, data: [{ ...mockProperty }] }, { status: 200 })
  ),

  /* ─── Property Images ─── */

  http.post(`${API}/api/properties/:id/images`, () =>
    HttpResponse.json({ data: mockProperty }, { status: 201 })
  ),

  http.delete(`${API}/api/properties/:propertyId/images/:imageId`, ({ params }) => {
    if (params.imageId === '999') {
      return HttpResponse.json({ message: 'Image introuvable.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API}/api/properties/:id/images/reorder`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.patch(`${API}/api/properties/:propertyId/images/:imageId/primary`, () =>
    HttpResponse.json({ data: mockProperty }, { status: 200 })
  ),

  /* ─── Admin ─── */

  http.get(`${API}/api/admin/properties/pending`, () =>
    HttpResponse.json({
      data: [mockPendingProperty],
      meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
    }, { status: 200 })
  ),

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
      data: {
        ...mockPendingProperty,
        id: parseInt(params.id),
        is_approved: isApproved,
        rejection_reason: body.rejection_reason ?? null,
      }
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
];
