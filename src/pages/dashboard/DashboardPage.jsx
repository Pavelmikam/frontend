import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Bookmark, Home, Plus, ShieldCheck, Bell, User, Eye, Briefcase,
  Users, TrendingUp, BarChart2, Building2, MapPin, FileText, Clock,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useTenantDashboard, useOwnerDashboard, usePopularProperties } from '@/hooks/useStatistics';
import { useMyContributorProfile } from '@/hooks/useNeighborhoodScore';
import { useFavorites } from '@/hooks/useFavorites';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import { useNotificationsList } from '@/hooks/useNotifications';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import NotificationItem from '@/components/notifications/NotificationItem';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import StatCard from '@/components/stats/StatCard';
import PeriodSelector from '@/components/stats/PeriodSelector';
import RequestsDonutChart from '@/components/stats/RequestsDonutChart';
import ViewsLineChart from '@/components/stats/ViewsLineChart';
import TopCitiesBarChart from '@/components/stats/TopCitiesBarChart';
import AvgPriceByTypeChart from '@/components/stats/AvgPriceByTypeChart';
import ContributorPointsBar from '@/components/neighborhood/ContributorPointsBar';
import ContributorBadgeDisplay from '@/components/neighborhood/ContributorBadgeDisplay';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

// ── Dashboard Locataire ───────────────────────────────────────────────────────

const TenantDashboard = ({ user }) => {
  const [period, setPeriod] = useState('30days');
  const { data, isLoading } = useTenantDashboard(period);
  const { data: contributorData } = useMyContributorProfile();
  const { data: popularData, isLoading: popularLoading } = usePopularProperties();
  const { data: searchData } = useSavedSearches();
  const { data: pendingData, isLoading: pendingLoading } = useRentalRequests({ status: 'en_attente' });

  const stats = data?.data ?? {};
  const requests = stats.requests ?? {};
  const searchCount = searchData?.data?.length ?? 0;
  const popularProperties = popularData?.data ?? [];
  const pendingRequests = pendingData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Votre tableau de bord locataire</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Candidatures totales" value={requests.total ?? '—'} icon={<Briefcase className="h-5 w-5" />} color="blue" isLoading={isLoading} />
        <StatCard title="En attente" value={requests.en_attente ?? '—'} icon={<Bell className="h-5 w-5" />} color="yellow" isLoading={isLoading} />
        <StatCard title="Acceptées" value={requests.acceptees ?? '—'} icon={<TrendingUp className="h-5 w-5" />} color="green" isLoading={isLoading} />
        <StatCard title="Annonces favorites" value={stats.favorites_count ?? '—'} icon={<Heart className="h-5 w-5" />} color="red" isLoading={isLoading} />
      </div>

      {/* Candidatures en attente avec l'annonce associée */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            Candidatures en attente
            {pendingRequests.length > 0 && (
              <span className="ml-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </h2>
          <Link to={ROUTES.MES_CANDIDATURES} className="text-xs text-blue-600 hover:underline">
            Voir toutes →
          </Link>
        </div>
        {pendingLoading ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : pendingRequests.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucune candidature en attente</p>
        ) : (
          <div className="space-y-2">
            {pendingRequests.slice(0, 5).map((req) => (
              <Link
                key={req.id}
                to={ROUTES.CANDIDATURE(req.id)}
                className="flex items-center justify-between gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {req.property?.title ?? 'Annonce inconnue'}
                    </p>
                    {req.property?.city && (
                      <p className="text-xs text-gray-500 truncate">{req.property.city}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-yellow-600 font-medium shrink-0">En attente</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidatures donut */}
        <div className="space-y-3">
          <RequestsDonutChart requests={requests} isLoading={isLoading} />
          <Link to={ROUTES.MES_CANDIDATURES} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Voir mes candidatures →
          </Link>
        </div>

        {/* Contribution */}
        {contributorData && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Ma contribution quartier
            </h2>
            <ContributorPointsBar points={contributorData.contributor_points ?? 0} />
            {contributorData.badges?.length > 0 && (
              <ContributorBadgeDisplay badges={contributorData.badges} />
            )}
            <Link to="/mon-profil-contributeur" className="text-sm text-blue-600 hover:underline">
              Voir mon profil contributeur →
            </Link>
          </div>
        )}
      </div>

      {/* Recherches sauvegardées */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Recherches sauvegardées</p>
            <p className="font-bold text-gray-900">{searchCount}/10</p>
          </div>
        </div>
        <Link to={ROUTES.MES_RECHERCHES} className="text-sm text-blue-600 hover:underline">Gérer →</Link>
      </div>

      {/* Annonces populaires */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Annonces populaires</h2>
          <Link to="/annonces/populaires" className="text-sm text-blue-600 hover:underline">Voir toutes →</Link>
        </div>
        {popularLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularProperties.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/annonces/${p.id}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                <p className="font-medium text-gray-900 truncate text-sm">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.city}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-semibold text-blue-600">{formatPrice(p.price)}/mois</p>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3 w-3" />{p.views_count ?? 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dashboard Propriétaire ────────────────────────────────────────────────────

const OwnerDashboard = ({ user }) => {
  const [period, setPeriod] = useState('30days');
  const { data, isLoading } = useOwnerDashboard(period);
  const { data: pendingData } = useRentalRequests({ status: 'en_attente' });
  const { data: recentNotifData } = useNotificationsList({ per_page: 5 });

  const stats = data?.data ?? {};
  const properties = stats.properties ?? {};
  const topProperties = stats.top_properties ?? [];
  const recentNotifs = recentNotifData?.data ?? [];
  const pendingRequests = pendingData?.data?.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Tableau de bord propriétaire</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Annonces actives" value={properties.active ?? '—'} icon={<Home className="h-5 w-5" />} color="green" isLoading={isLoading} />
        <StatCard title="Vues totales" value={stats.views_total ?? '—'} unit="vues" icon={<Eye className="h-5 w-5" />} color="blue" isLoading={isLoading} />
        <StatCard title="Candidatures reçues" value={stats.requests_total ?? '—'} icon={<Users className="h-5 w-5" />} color="purple" isLoading={isLoading} />
        <StatCard title="Revenu potentiel" value={stats.potential_revenue ? formatPrice(stats.potential_revenue) : '—'} icon={<TrendingUp className="h-5 w-5" />} color="orange" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top annonces les plus vues */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            Mes annonces les plus vues
          </h2>
          {isLoading ? <div className="flex justify-center py-6"><Spinner /></div> : (
            <div className="space-y-3">
              {topProperties.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-800 truncate flex-1">{p.title}</p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-gray-500" title="Vues">
                      <Eye className="h-3 w-3" />{p.views_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-purple-600 font-medium" title="Candidatures reçues">
                      <FileText className="h-3 w-3" />{p.requests_count ?? 0}
                    </span>
                    <Link to={`/mes-annonces/${p.id}/stats`} className="text-xs text-blue-600 hover:underline">
                      Stats →
                    </Link>
                  </div>
                </div>
              ))}
              {!topProperties.length && (
                <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
              )}
            </div>
          )}
        </div>

        {/* Candidatures en attente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-600" />
              Candidatures en attente
            </h2>
            <Link to={ROUTES.MES_ANNONCES} className="text-xs text-blue-600 hover:underline">Voir toutes →</Link>
          </div>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucune candidature en attente</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <Link key={req.id} to={ROUTES.CANDIDATURE(req.id)}
                  className="flex items-center justify-between gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{req.tenant?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{req.property?.title}</p>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">En attente</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activité récente */}
      {recentNotifs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              Activité récente
            </h2>
            <Link to="/notifications" className="text-sm text-blue-600 hover:underline">Voir toutes →</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {recentNotifs.map((notif, idx) => (
              <div key={notif.id} className={idx < recentNotifs.length - 1 ? 'border-b border-gray-100' : ''}>
                <NotificationItem notification={notif} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        to={ROUTES.MES_ANNONCES_CREER}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-full shadow-lg transition-colors z-30"
      >
        <Plus className="h-4 w-4" />
        Nouvelle annonce
      </Link>
    </div>
  );
};

// ── Dashboard Admin ───────────────────────────────────────────────────────────

const AdminDashboardView = ({ user }) => {
  const [period, setPeriod] = useState('30days');
  const { data: adminData, isLoading } = useAdminDashboard();
  const stats = adminData?.stats ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Utilisateurs totaux" value={stats.total_users} icon={<Users className="h-5 w-5" />} color="blue" isLoading={isLoading} />
        <StatCard title="Annonces actives" value={stats.active_properties} icon={<Building2 className="h-5 w-5" />} color="green" isLoading={isLoading} />
        <StatCard title="Signalements en attente" value={stats.pending_reports} icon={<ShieldCheck className="h-5 w-5" />} color="red" isLoading={isLoading} />
        <StatCard title="Candidatures en attente" value={stats.pending_rental_requests} icon={<Briefcase className="h-5 w-5" />} color="yellow" isLoading={isLoading} />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Modérer les annonces', path: ROUTES.ADMIN_MODERATION,   icon: ShieldCheck, color: 'text-purple-600' },
          { label: 'Signalements',         path: ROUTES.ADMIN_SIGNALEMENTS, icon: Bell,        color: 'text-red-600' },
          { label: 'Statistiques avancées', path: ROUTES.ADMIN_STATISTIQUES, icon: BarChart2,  color: 'text-blue-600' },
        ].map(({ label, path, icon: Icon, color }) => (
          <Link key={path} to={path}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors text-sm font-medium text-gray-700">
            <Icon className={`h-5 w-5 ${color}`} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────

const DashboardPage = () => {
  const { user, isEmailVerified, isLocataire, isProprietaire, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      {!isEmailVerified && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Email non vérifié</p>
            <p className="text-sm text-orange-600 mt-0.5">
              Vérifiez votre email pour accéder à toutes les fonctionnalités.{' '}
              <Link to={ROUTES.VERIFY_EMAIL} className="underline font-medium">Vérifier maintenant</Link>
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-400" />
        <Badge role={user?.role} />
      </div>

      {isLocataire   && <TenantDashboard user={user} />}
      {isProprietaire && <OwnerDashboard  user={user} />}
      {isAdmin       && <AdminDashboardView user={user} />}
    </div>
  );
};

export default DashboardPage;
