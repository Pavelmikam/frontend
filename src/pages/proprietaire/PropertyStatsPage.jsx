import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Eye, FileText, TrendingUp, Heart, ArrowLeft, Building2 } from 'lucide-react';
import { usePropertyStats } from '@/hooks/useStatistics';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import { useExports } from '@/hooks/useExports';
import StatCard from '@/components/stats/StatCard';
import PeriodSelector from '@/components/stats/PeriodSelector';
import ViewsLineChart from '@/components/stats/ViewsLineChart';
import RequestsDonutChart from '@/components/stats/RequestsDonutChart';
import ConversionRateMeter from '@/components/stats/ConversionRateMeter';
import ExportButton from '@/components/stats/ExportButton';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatters';

const PropertyStatsPage = () => {
  const { id } = useParams();
  const propertyId = parseInt(id, 10);
  const [period, setPeriod] = useState('30days');
  const { data, isLoading } = usePropertyStats(propertyId, period);
  const { data: requestsData, isLoading: reqLoading } = useRentalRequests({ property_id: propertyId });
  const { loading: exportLoading, exportPropertyReport } = useExports();

  const stats = data?.data ?? {};
  const views = stats.views ?? {};
  const requests = stats.requests ?? {};
  const recentRequests = requestsData?.data?.slice(0, 5) ?? [];

  const PERIOD_LABELS = {
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
    '90days': '3 derniers mois',
    '1year': '12 derniers mois',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to={ROUTES.MES_ANNONCES} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="h-4 w-4" /> Mes annonces
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques de l'annonce</h1>
          <p className="text-gray-500 text-sm mt-1">Annonce #{propertyId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`${ROUTES.MES_ANNONCES}/${propertyId}/modifier`}
            className="text-sm border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Modifier l'annonce
          </Link>
          <ExportButton
            label="Rapport PDF"
            onExport={() => exportPropertyReport(propertyId, period)}
            isLoading={exportLoading.propertyReport}
            format="pdf"
            variant="primary"
          />
        </div>
      </div>

      {/* Période */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Période :</span>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Vues totales" value={views.total} unit="vues" icon={<Eye className="h-5 w-5" />} color="blue" isLoading={isLoading} />
        <StatCard title="Vues uniques" value={views.unique} icon={<Eye className="h-5 w-5" />} color="purple" isLoading={isLoading} />
        <StatCard title="Candidatures" value={requests.total} icon={<FileText className="h-5 w-5" />} color="green" isLoading={isLoading} />
        <StatCard title="Taux conversion" value={stats.conversion_rate != null ? `${stats.conversion_rate?.toFixed(1)}%` : '—'} icon={<TrendingUp className="h-5 w-5" />} color="orange" isLoading={isLoading} />
        <StatCard title="Favoris" value={stats.favorites_count} icon={<Heart className="h-5 w-5" />} color="red" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline vues */}
        <ViewsLineChart
          data={views.by_day ?? {}}
          period={PERIOD_LABELS[period]}
          isLoading={isLoading}
          title="Vues par jour"
        />

        {/* Donut candidatures */}
        <RequestsDonutChart requests={requests} isLoading={isLoading} />
      </div>

      {/* Taux de conversion */}
      <ConversionRateMeter
        rate={stats.conversion_rate ?? 0}
        views={views.total ?? 0}
        requests={requests.total ?? 0}
        isLoading={isLoading}
      />

      {/* Candidatures récentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Candidatures récentes</h2>
          <Link to={`${ROUTES.MES_ANNONCES}/${propertyId}/candidatures`}
            className="text-xs text-blue-600 hover:underline">Voir toutes →</Link>
        </div>
        {reqLoading ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : recentRequests.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Building2 className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">Aucune candidature</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <Link key={req.id} to={ROUTES.CANDIDATURE(req.id)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{req.tenant?.name}</p>
                  <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  req.status === 'acceptee' ? 'bg-green-100 text-green-700' :
                  req.status === 'refusee'  ? 'bg-red-100 text-red-700' :
                                              'bg-yellow-100 text-yellow-700'
                }`}>
                  {req.status === 'en_attente' ? 'En attente' :
                   req.status === 'acceptee'  ? 'Acceptée' : 'Refusée'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyStatsPage;
