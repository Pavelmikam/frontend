import { useState } from 'react';
import { Eye, TrendingUp, Building2 } from 'lucide-react';
import { useAdminAdvancedStats, useViewsTimeline, useTopProperties } from '@/hooks/useStatistics';
import PeriodSelector from '@/components/stats/PeriodSelector';
import TopCitiesBarChart from '@/components/stats/TopCitiesBarChart';
import AvgPriceByTypeChart from '@/components/stats/AvgPriceByTypeChart';
import ViewsLineChart from '@/components/stats/ViewsLineChart';
import Spinner from '@/components/ui/Spinner';
import Select from '@/components/ui/Select';
import { CITIES_CAMEROUN, TOP_METRICS } from '@/utils/constants';
import { formatPrice } from '@/utils/formatters';

const CITY_OPTIONS = [
  { value: '', label: 'Toutes les villes' },
  ...CITIES_CAMEROUN.map((c) => ({ value: c, label: c })),
];

const TAB_LABELS = ['Vue d\'ensemble', 'Timeline des vues', 'Top annonces'];

const AdminStatisticsPage = () => {
  const [period, setPeriod] = useState('30days');
  const [city, setCity] = useState('');
  const [tab, setTab] = useState(0);
  const [metric, setMetric] = useState('views_count');

  const { data: statsData, isLoading: statsLoading } = useAdminAdvancedStats(period, city || null);
  const { data: timelineData, isLoading: timelineLoading } = useViewsTimeline(period, null);
  const { data: topData, isLoading: topLoading } = useTopProperties(metric);

  const stats = statsData?.data ?? {};
  const timeline = timelineData?.data ?? [];
  const topProperties = topData?.data ?? [];

  const metricLabel = TOP_METRICS.find((m) => m.value === metric)?.label ?? 'Vues';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques avancées</h1>
        <p className="text-gray-500 mt-1">Analyse globale de la plateforme</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <PeriodSelector value={period} onChange={setPeriod} />
        <div className="w-full sm:w-44">
          <Select options={CITY_OPTIONS} value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 border-b border-gray-200">
        {TAB_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === i
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Onglet 0 : Vue d'ensemble */}
      {tab === 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopCitiesBarChart data={stats.top_cities ?? []} isLoading={statsLoading} title="Top villes — annonces actives" />
            <AvgPriceByTypeChart data={stats.top_types ?? []} isLoading={statsLoading} title="Loyer moyen par type de bien" />
          </div>

          {/* Taux d'acceptation */}
          {!statsLoading && stats.acceptance_rate != null && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Taux d'acceptation des demandes</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600">{stats.acceptance_rate?.toFixed(1)}%</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(stats.acceptance_rate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Onglet 1 : Timeline */}
      {tab === 1 && (
        <div className="space-y-4">
          <ViewsLineChart
            data={timeline.map((d) => ({ date: d.date, count: d.total_views }))}
            period={period}
            isLoading={timelineLoading}
            title="Vues totales par jour"
          />
        </div>
      )}

      {/* Onglet 2 : Top annonces */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Trier par :</span>
            {TOP_METRICS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMetric(m.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  metric === m.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {topLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Titre</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Ville</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 flex items-center justify-end gap-1">
                      <Eye className="h-3.5 w-3.5" /> Vues
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Favoris</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Demandes</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Propriétaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProperties.slice(0, 20).map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.title}</td>
                      <td className="px-4 py-3 text-gray-500">{p.city}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{p.views_count ?? 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{p.favorites_count ?? 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{p.requests_count ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.owner?.name ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!topProperties.length && (
                <div className="flex items-center justify-center py-10 text-gray-400">
                  <Building2 className="h-8 w-8 mr-2 opacity-30" />
                  <p className="text-sm">Aucune donnée</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStatisticsPage;
