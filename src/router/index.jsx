import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import PrivateRoute  from '@/guards/PrivateRoute';
import GuestRoute    from '@/guards/GuestRoute';
import RoleRoute     from '@/guards/RoleRoute';

import PublicLayout  from '@/components/layout/PublicLayout';
import PrivateLayout from '@/components/layout/PrivateLayout';
import HomeLayout    from '@/components/layout/HomeLayout';

import HomePage from '@/pages/home/HomePage';

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

import MyRequestsPage       from '@/pages/locataire/MyRequestsPage';
import RequestDetailPage    from '@/pages/locataire/RequestDetailPage';
import PropertyRequestsPage from '@/pages/proprietaire/PropertyRequestsPage';
import MessagingPage        from '@/pages/messaging/MessagingPage';
import ConversationPage     from '@/pages/messaging/ConversationPage';
import NotificationsPage           from '@/pages/notifications/NotificationsPage';
import NotificationPreferencesPage from '@/pages/profile/NotificationPreferencesPage';
import AdminDashboardPage     from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage         from '@/pages/admin/AdminUsersPage';
import AdminUserDetailPage    from '@/pages/admin/AdminUserDetailPage';
import AdminReportsPage       from '@/pages/admin/AdminReportsPage';
import AdminCategoriesPage    from '@/pages/admin/AdminCategoriesPage';
import AdminLogsPage          from '@/pages/admin/AdminLogsPage';
import AdminNeighborhoodPage  from '@/pages/admin/AdminNeighborhoodPage';
import NeighborhoodPage       from '@/pages/neighborhood/NeighborhoodPage';
import ContributorProfilePage from '@/pages/neighborhood/ContributorProfilePage';
import PropertyStatsPage      from '@/pages/proprietaire/PropertyStatsPage';
import PopularPropertiesPage  from '@/pages/properties/PopularPropertiesPage';
import AdminStatisticsPage    from '@/pages/admin/AdminStatisticsPage';
import AdminExportPage        from '@/pages/admin/AdminExportPage';

import useAuthStore from '@/store/authStore';
import { ROUTES } from '@/utils/constants';

const RootLayout = () => {
  const navigate = useNavigate();
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logoutAction = useAuthStore((state) => state.logoutAction);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logoutAction();
      navigate(ROUTES.HOME, { replace: true });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate, logoutAction]);

  return <Outlet />;
};

const router = createBrowserRouter(
[
  {
    element: <RootLayout />,

    children: [
      /* ── Home page (visiteurs) ── */
      {
        element: <HomeLayout />,
        children: [
          { path: '/', element: <HomePage /> },
        ],
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
          { path: '/annonces',              element: <PublicListingPage /> },
          { path: '/annonces/:id',          element: <PropertyDetailPage /> },
          { path: '/annonces/populaires',   element: <PopularPropertiesPage /> },
          { path: '/score-quartier',        element: <NeighborhoodPage /> },
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
              { path: '/mes-candidatures',             element: <MyRequestsPage /> },
              { path: '/candidatures/:id',             element: <RequestDetailPage /> },
              { path: '/messagerie',                   element: <MessagingPage /> },
              { path: '/messagerie/:id',               element: <ConversationPage /> },
              { path: '/notifications',                element: <NotificationsPage /> },
              { path: '/profil/notifications',         element: <NotificationPreferencesPage /> },
              { path: '/mon-profil-contributeur',      element: <ContributorProfilePage /> },
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
              { path: '/mes-annonces',                        element: <MyPropertiesPage /> },
              { path: '/mes-annonces/creer',                  element: <CreatePropertyPage /> },
              { path: '/mes-annonces/:id/modifier',           element: <EditPropertyPage /> },
              { path: '/mes-annonces/:id/candidatures',       element: <PropertyRequestsPage /> },
              { path: '/mes-annonces/:id/stats',              element: <PropertyStatsPage /> },
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
              { path: '/admin/moderation',          element: <PendingPropertiesPage /> },
              { path: '/admin',                      element: <AdminDashboardPage /> },
              { path: '/admin/utilisateurs',         element: <AdminUsersPage /> },
              { path: '/admin/utilisateurs/:id',     element: <AdminUserDetailPage /> },
              { path: '/admin/signalements',         element: <AdminReportsPage /> },
              { path: '/admin/categories',           element: <AdminCategoriesPage /> },
              { path: '/admin/journal',              element: <AdminLogsPage /> },
              { path: '/admin/quartiers',            element: <AdminNeighborhoodPage /> },
              { path: '/admin/statistiques',         element: <AdminStatisticsPage /> },
              { path: '/admin/exports',              element: <AdminExportPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
],
{
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
});

const AppRouter = () => (
  <RouterProvider router={router} future={{ v7_startTransition: true }} />
);

export default AppRouter;
