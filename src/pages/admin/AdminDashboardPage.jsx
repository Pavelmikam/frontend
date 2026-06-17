import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Home, Briefcase, Flag, MessageSquare,
  AlertTriangle, ShieldCheck
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import KpiCard from '@/components/admin/KpiCard';
import Spinner from '@/components/ui/Spinner';

const Charts = lazy(() => import('./AdminDashboardCharts'));

const AdminDashboardPage = () => {
  const { data, isLoading } = useAdminDashboard();

  // Backend returns nested: { users:{}, properties:{}, rental_requests:{}, reports:{}, conversations:{} }
  const users          = data?.users          ?? {};
  const properties     = data?.properties     ?? {};
  const rentalRequests = data?.rental_requests ?? {};
  const reports        = data?.reports        ?? {};
  const conversations  = data?.conversations  ?? {};

  const kpis = [
    { title: 'Utilisateurs totaux',     value: users.total,                  icon: <Users className="h-5 w-5" />,        color: 'blue'   },
    { title: 'Annonces actives',         value: properties.active,            icon: <Home className="h-5 w-5" />,         color: 'green'  },
    { title: 'Candidatures en attente',  value: rentalRequests.en_attente,    icon: <Briefcase className="h-5 w-5" />,    color: 'yellow' },
    { title: 'Signalements en attente',  value: reports.pending,              icon: <Flag className="h-5 w-5" />,         color: 'red'    },
    { title: 'Annonces brouillon',        value: properties.draft,             icon: <ShieldCheck className="h-5 w-5" />,  color: 'purple' },
    { title: "Messages aujourd'hui",     value: conversations.messages_today, icon: <MessageSquare className="h-5 w-5" />, color: 'blue'  },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme ImmoConnect</p>
      </div>

      {/* Alertes */}
      {!isLoading && reports.pending > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">
              {reports.pending} signalement(s) en attente de traitement
            </p>
          </div>
          <Link to={ROUTES.ADMIN_SIGNALEMENTS} className="text-sm text-red-700 font-medium hover:underline">
            Traiter →
          </Link>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} isLoading={isLoading} />
        ))}
      </div>

      {/* Répartition utilisateurs */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Locataires</p>
            <p className="text-xl font-bold text-blue-600">{users.locataires ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Propriétaires</p>
            <p className="text-xl font-bold text-green-600">{users.proprietaires ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Admins</p>
            <p className="text-xl font-bold text-purple-600">{users.admins ?? 0}</p>
          </div>
        </div>
      )}

      {/* Graphiques (lazy) */}
      {data?.charts && (
        <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
          <Charts charts={data.charts} />
        </Suspense>
      )}

      {/* Score de Quartier */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Score de Quartier</h2>
            <p className="text-sm text-gray-500 mt-0.5">Évaluations collaboratives des quartiers</p>
          </div>
          <Link
            to={ROUTES.ADMIN_QUARTIERS}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Gérer →
          </Link>
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: 'Utilisateurs', path: ROUTES.ADMIN_UTILISATEURS, icon: Users },
          { label: 'Signalements', path: ROUTES.ADMIN_SIGNALEMENTS, icon: Flag },
          { label: 'Catégories',   path: ROUTES.ADMIN_CATEGORIES,   icon: Home },
          { label: 'Journal',      path: ROUTES.ADMIN_JOURNAL,      icon: ShieldCheck },
        ].map(({ label, path, icon: Icon }) => (
          <Link key={path} to={path}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors text-sm font-medium text-gray-700"
          >
            <Icon className="h-4 w-4 text-blue-600" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
