# ImmoConnect Frontend — Phase 4

## Correction définitive jsdom
`axiosInstance.js` utilise désormais un `CustomEvent 'auth:unauthorized'`
au lieu de `window.location.*` → aucun avertissement "Not implemented: navigation" dans les tests.

L'écouteur est placé dans `RootLayout` (router/index.jsx), composant racine
rendu à l'intérieur du `RouterProvider` pour accéder à `useNavigate`.

## Nouvelles fonctionnalités
- Postuler sur un bien (`/annonces/:id` → bouton Postuler → `ApplyModal`)
- Mes candidatures avec onglets statuts (`/mes-candidatures`)
- Détail d'une candidature + dossier locatif (`/candidatures/:id`)
- Upload documents (PDF/JPG/PNG, max 10 MB, 1 par type)
- Téléchargement sécurisé via URL signée (5 min)
- Décision propriétaire : accepter/refuser avec motif obligatoire
- Planification et confirmation de visite
- Candidatures reçues par annonce (`/mes-annonces/:id/candidatures`)
- Dashboard mis à jour : sections candidatures pour locataire et propriétaire
- Navbar : lien "Candidatures" (locataire) + badge compte en attente

## Endpoints Backend consommés (Phase 4)
```
GET    /api/rental-requests                            (auth)
GET    /api/rental-requests/:id                        (auth)
POST   /api/rental-requests/properties/:propertyId     (locataire)
POST   /api/rental-requests/:id/decide                 (propriétaire)
POST   /api/rental-requests/:id/cancel                 (locataire)
POST   /api/rental-requests/:id/schedule-visit         (propriétaire)
POST   /api/rental-requests/:id/confirm-visit          (locataire)
POST   /api/rental-requests/:id/documents              (locataire)
DELETE /api/rental-requests/:id/documents/:docId       (locataire)
GET    /api/documents/:docId/download                  (auth)
POST   /api/documents/:docId/verify                    (admin)
```

## Architecture ajoutée
```
src/api/rentalRequest.api.js
src/hooks/useRentalRequests.js
src/hooks/useDocumentMutations.js
src/components/ui/RentalStatusBadge.jsx
src/components/rental/RentalRequestCard.jsx
src/components/rental/DecideRequestModal.jsx
src/components/rental/VisitScheduler.jsx
src/components/rental/DossierLocatif.jsx
src/components/rental/RequestMessageThread.jsx
src/components/rental/ApplyModal.jsx
src/pages/locataire/MyRequestsPage.jsx
src/pages/locataire/RequestDetailPage.jsx
src/pages/proprietaire/PropertyRequestsPage.jsx
src/tests/api/rentalRequest.test.js
src/tests/api/rentalDocument.test.js
src/tests/api/rentalRequest.workflow.test.js
```

## Lancer les tests (zéro avertissement attendu)
```bash
npm run test:run
```
Total attendu : ~97 tests (77 existants + ~20 Phase 4)
