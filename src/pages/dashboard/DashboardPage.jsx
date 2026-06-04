import { Link } from 'react-router-dom';
import { Heart, Bookmark, Home, Plus, ShieldCheck, Bell, User, Eye, Briefcase, Users } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useMyProperties } from '@/hooks/useMyProperties';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import Badge from '@/components/ui/Badge';
import { ROUTES } from '@/utils/constants';

const DashboardPage = () => {
  const { user, isEmailVerified, isLocataire, isProprietaire, isAdmin } = useAuth();

  const { data: favData } = useFavorites({});
  const { data: searchData } = useSavedSearches();
  const { data: myPropsData } = useMyProperties();
  const { data: myRequestsData } = useRentalRequests({}, { enabled: isLocataire });
  const { data: pendingRequestsData } = useRentalRequests(
    { status: 'en_attente' },
    { enabled: isLocataire || isProprietaire }
  );

  const favCount = favData?.meta?.total ?? 0;
  const searchCount = searchData?.data?.length ?? 0;
  const myPropsCount = myPropsData?.meta?.total ?? myPropsData?.data?.length ?? 0;
  const totalViews = myPropsData?.data?.reduce((sum, p) => sum + (p.views_count || 0), 0) ?? 0;
  const myRequestsCount = myRequestsData?.meta?.total ?? myRequestsData?.data?.length ?? 0;
  const pendingRequestsCount = pendingRequestsData?.meta?.total ?? pendingRequestsData?.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Bienvenue sur votre tableau de bord ImmoConnect</p>
      </div>

      {!isEmailVerified && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Email non vérifié</p>
            <p className="text-sm text-orange-600 mt-0.5">
              Vérifiez votre email pour accéder à toutes les fonctionnalités.{' '}
              <Link to={ROUTES.VERIFY_EMAIL} className="underline font-medium">
                Vérifier maintenant
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-400" />
        <Badge role={user?.role} />
      </div>

      {/* Locataire */}
      {isLocataire && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mes favoris</p>
                <p className="font-bold text-gray-900 text-lg">{favCount}</p>
              </div>
            </div>
            <Link to={ROUTES.MES_FAVORIS} className="text-sm text-blue-600 hover:underline">
              Voir mes favoris →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mes recherches</p>
                <p className="font-bold text-gray-900 text-lg">{searchCount}</p>
              </div>
            </div>
            <Link to={ROUTES.MES_RECHERCHES} className="text-sm text-blue-600 hover:underline">
              Gérer mes recherches →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mes candidatures</p>
                <p className="font-bold text-gray-900 text-lg">{myRequestsCount}</p>
              </div>
            </div>
            <Link to="/mes-candidatures" className="text-sm text-blue-600 hover:underline">
              Voir mes candidatures →
            </Link>
          </div>

          {pendingRequestsCount > 0 && (
            <div className="md:col-span-2 lg:col-span-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-800">
                  {pendingRequestsCount} candidature(s) en attente de réponse
                </p>
              </div>
              <Link to="/mes-candidatures" className="text-sm text-indigo-700 font-medium hover:underline">
                Voir →
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Explorer</p>
                <p className="font-bold text-gray-900">Annonces</p>
              </div>
            </div>
            <Link to={ROUTES.ANNONCES} className="text-sm text-blue-600 hover:underline">
              Parcourir les annonces →
            </Link>
          </div>
        </div>
      )}

      {/* Propriétaire */}
      {isProprietaire && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mes annonces</p>
                <p className="font-bold text-gray-900 text-lg">{myPropsCount}</p>
              </div>
            </div>
            <Link to={ROUTES.MES_ANNONCES} className="text-sm text-blue-600 hover:underline">
              Gérer mes annonces →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vues totales</p>
                <p className="font-bold text-gray-900 text-lg">{totalViews}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Sur toutes vos annonces</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Candidatures reçues</p>
                <p className="font-bold text-gray-900 text-lg">{pendingRequestsCount}</p>
              </div>
            </div>
            <Link to={ROUTES.MES_ANNONCES} className="text-sm text-blue-600 hover:underline">
              Voir mes annonces →
            </Link>
          </div>

          {pendingRequestsCount > 0 && (
            <div className="md:col-span-2 lg:col-span-3 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-medium text-orange-800">
                  {pendingRequestsCount} candidature(s) en attente sur vos biens
                </p>
              </div>
              <Link to={ROUTES.MES_ANNONCES} className="text-sm text-orange-700 font-medium hover:underline">
                Traiter →
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between">
            <p className="text-sm font-medium text-gray-700 mb-4">Publier une nouvelle annonce</p>
            <Link
              to={ROUTES.MES_ANNONCES_CREER}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Déposer une annonce
            </Link>
          </div>
        </div>
      )}

      {/* Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Modération</p>
                <p className="font-bold text-gray-900">Biens en attente</p>
              </div>
            </div>
            <Link to={ROUTES.ADMIN_MODERATION} className="text-sm text-blue-600 hover:underline">
              Accéder à la modération →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Les statistiques complètes seront disponibles en Phase 7.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
