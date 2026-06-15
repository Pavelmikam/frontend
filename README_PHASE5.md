# ImmoConnect Frontend — Phase 5

## Nouvelles fonctionnalités
- Messagerie interne complète (`/messagerie`)
- Liste conversations triée par activité avec onglet Archivées
- Vue conversation avec polling automatique (5s)
- Envoi de messages texte + pièces jointes (JPG/PNG/WebP/PDF, max 3×5 Mo)
- Messages immuables — aucun bouton modifier/supprimer
- Badge non-lus global dans la Navbar (rafraîchi toutes les 30s)
- Archivage individuel des conversations
- Bouton "Contacter le propriétaire" sur les annonces
- Bouton "Message" sur les candidatures (RentalRequestCard)
- Polling suspendu automatiquement si onglet inactif (visibilityState)

## Règle fondamentale
Les messages NE PEUVENT PAS être modifiés ni supprimés.
`messaging.api.js` n'exporte aucune fonction `updateMessage` ni `deleteMessage`.

## Dépendances ajoutées
- `timeago.js` (dates relatives)

## Endpoints Backend consommés (Phase 5)
```
GET    /api/messaging/unread-count
GET    /api/conversations
GET    /api/conversations/:id
POST   /api/conversations/properties/:propertyId
POST   /api/conversations/:id/read
POST   /api/conversations/:id/archive
POST   /api/conversations/:id/unarchive
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
GET    /api/conversations/:id/messages/since  (polling)
```

## Endpoints inexistants (immuabilité)
```
PUT    /api/conversations/:id/messages/:msgId  ← N'EXISTE PAS
DELETE /api/conversations/:id/messages/:msgId  ← N'EXISTE PAS
```

## Total tests attendus après Phase 5 : ~117 tests

## Lancer les tests
```bash
npm run test:run
```
