import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import PrivateRoute  from '@/guards/PrivateRoute';
import GuestRoute    from '@/guards/GuestRoute';
import RoleRoute     from '@/guards/RoleRoute';

import PublicLayout  from '@/components/layout/PublicLayout';
import PrivateLayout from '@/components/layout/PrivateLayout';

import LoginPage          from '@/pages/auth/LoginPage';
import RegisterPage       from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage    from '@/pages/auth/VerifyEmailPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProfilePage   from '@/pages/profile/ProfilePage';
import NotFoundPage  from '@/pages/NotFoundPage';

import PublicListingPage    from '@/pages/properties/PublicListingPage';
import PropertyDetailPage   from '@/pages/properties/PropertyDetailPage';
import MyPropertiesPage     from '@/pages/proprietaire/MyPropertiesPage';
import CreatePropertyPage   from '@/pages/proprietaire/CreatePropertyPage';
import EditPropertyPage     from '@/pages/proprietaire/EditPropertyPage';
import PendingPropertiesPage from '@/pages/admin/PendingPropertiesPage';

import FavoritesPage           from '@/pages/locataire/FavoritesPage';
import SavedSearchesPage       from '@/pages/locataire/SavedSearchesPage';
import SavedSearchResultsPage  from '@/pages/search/SavedSearchResultsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  /* ── Guest-only routes ── */
  {
    element: <GuestRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login',           element: <LoginPage /> },
          { path: '/register',        element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password',  element: <ResetPasswordPage /> },
        ],
      },
    ],
  },

  { path: '/verify-email', element: <VerifyEmailPage /> },

  /* ── Public property routes (accessible to all) ── */
  {
    element: <PrivateLayout />,
    children: [
      { path: '/annonces',     element: <PublicListingPage /> },
      { path: '/annonces/:id', element: <PropertyDetailPage /> },
    ],
  },

  /* ── Authenticated routes ── */
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile',   element: <ProfilePage /> },
          { path: '/mes-favoris',                  element: <FavoritesPage /> },
          { path: '/mes-recherches',               element: <SavedSearchesPage /> },
          { path: '/mes-recherches/:id/resultats', element: <SavedSearchResultsPage /> },
        ],
      },
    ],
  },

  /* ── Propriétaire routes ── */
  {
    element: <RoleRoute roles={['proprietaire', 'admin']} />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: '/mes-annonces',              element: <MyPropertiesPage /> },
          { path: '/mes-annonces/creer',        element: <CreatePropertyPage /> },
          { path: '/mes-annonces/:id/modifier', element: <EditPropertyPage /> },
        ],
      },
    ],
  },

  /* ── Admin routes ── */
  {
    element: <RoleRoute roles={['admin']} />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: '/admin/moderation', element: <PendingPropertiesPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
