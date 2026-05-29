# ImmoConnect Frontend — Phase 1

## Prérequis
- Node.js 20+
- Backend Laravel tournant sur http://localhost:8000

## Installation
```bash
npm install
```

## Variables d'environnement
Copier `.env.example` vers `.env` et configurer `VITE_API_URL` :
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=ImmoConnect
```

## Lancer les tests
```bash
npm run test          # mode watch
npm run test:run      # run unique
npm run test:ui       # interface visuelle Vitest
npm run coverage      # rapport de couverture
```

## Lancer le serveur de développement
```bash
npm run dev
```

## Architecture
```
src/
├── api/          → appels HTTP (auth.api.js, user.api.js, axiosInstance.js)
├── store/        → état global Zustand (authStore.js)
├── hooks/        → hooks custom (useAuth, useProfile)
├── components/   → composants UI réutilisables + layouts
├── guards/       → PrivateRoute, GuestRoute, RoleRoute
├── pages/        → pages auth + dashboard + profil
├── router/       → configuration React Router v6
├── utils/        → helpers (tokenUtils, formatters, constants)
└── tests/        → tests unitaires (MSW v2 + Vitest)
```

## Endpoints Backend consommés (Phase 1)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/email/resend
GET    /api/user/profile
PUT    /api/user/profile
POST   /api/user/avatar
PUT    /api/user/password
```

## Stack technique
- React 19 + Vite 5
- React Router v6
- Zustand (état global)
- Axios (HTTP client)
- React Hook Form + Zod (formulaires + validation)
- TailwindCSS (styles)
- Lucide React (icônes)
- React Hot Toast (notifications)
- Vitest + MSW v2 + Testing Library (tests)
