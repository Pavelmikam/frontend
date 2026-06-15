# ImmoConnect Frontend — Phase 6

## Corrections appliquées
- `vite.config.js` : `pool: 'vmThreads'` → fin des erreurs EPERM Windows
- `router/index.jsx` : future flags v7 → fin des warnings React Router

## Nouvelles fonctionnalités
- Badge notifications non-lues dans la Navbar (polling 30s) — `NotificationBellButton`
- Dropdown de notifications (5 dernières, marquer lu, lien vers /notifications)
- Centre de notifications `/notifications` (liste complète, filtres, pagination)
- Préférences de notifications `/profil/notifications`
  (canal email activable, types individuels selon rôle, sauvegarde immédiate)
- Onglet "Notifications" dans ProfilePage
- Section "Activité récente" sur le Dashboard (5 dernières notifications)

## 8 types de notifications gérés

| Type | Destinataire |
|------|-------------|
| rental_request_received | Propriétaire |
| rental_request_accepted | Locataire |
| rental_request_refused  | Locataire |
| message_received        | Participants sauf expéditeur |
| property_approved       | Propriétaire |
| property_rejected       | Propriétaire |
| visit_scheduled         | Locataire |
| saved_search_match      | Locataire |

## Règle : canal "database" toujours actif
Le toggle in-app est grisé et non modifiable dans l'UI.
Le backend garantit toujours la notification in-app.

## Dépendances ajoutées
Aucune (tout déjà installé phases précédentes)

## Endpoints Backend consommés (Phase 6)
```
GET    /api/notifications                  (auth)
GET    /api/notifications/unread-count     (auth — polling 30s)
POST   /api/notifications/mark-all-read    (auth)
POST   /api/notifications/:id/read         (auth — UUID)
DELETE /api/notifications/:id              (auth — UUID)
GET    /api/notification-preferences       (auth)
PUT    /api/notification-preferences       (auth)
```

## Total tests attendus après Phase 6 : ~173 tests

## Lancer les tests (zéro avertissement)
```bash
npm run test:run
```
