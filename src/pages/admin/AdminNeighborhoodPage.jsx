import { useState } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { useAdminNeighborhoodReports, useAdminNeighborhoodMutations } from '@/hooks/useAdminNeighborhood';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { CITIES_CAMEROUN } from '@/utils/constants';
import NeighborhoodReportRow from '@/components/neighborhood/NeighborhoodReportRow';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

const AdminNeighborhoodPage = () => {
  const [filters, setFilters] = useState({ is_flagged: '', criterion: '', city: '' });
  const [recomputeCity, setRecomputeCity] = useState('');

  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
  const { data, isLoading } = useAdminNeighborhoodReports(params);
  const { flag, validate, recompute } = useAdminNeighborhoodMutations();

  const reports = data?.data ?? [];
  const meta = data?.meta ?? {};

  const total = meta.total ?? reports.length;
  const flagged = reports.filter((r) => r.is_flagged).length;
  const cities = [...new Set(reports.map((r) => r.city).filter(Boolean))].length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Score de Quartier — Modération</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestion des évaluations de quartier soumises par les contributeurs</p>
        </div>
        <MapPin className="h-7 w-7 text-blue-600" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Rapports totaux',  value: total,  color: 'blue'   },
          { label: 'Rapports suspects', value: flagged, color: 'red'   },
          { label: 'Villes couvertes', value: cities, color: 'green' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recalcul scores */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Recalculer les scores d'une ville</p>
        <div className="flex gap-3">
          <select
            value={recomputeCity}
            onChange={(e) => setRecomputeCity(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une ville</option>
            {CITIES_CAMEROUN.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button
            variant="primary"
            onClick={() => recomputeCity && recompute.mutate({ city: recomputeCity })}
            disabled={!recomputeCity || recompute.isPending}
            isLoading={recompute.isPending}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Recalculer
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={filters.is_flagged}
            onChange={(e) => setFilters((f) => ({ ...f, is_flagged: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les rapports</option>
            <option value="false">Validés uniquement</option>
            <option value="true">Suspects uniquement</option>
          </select>
          <select
            value={filters.city}
            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les villes</option>
            {CITIES_CAMEROUN.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => setFilters({ is_flagged: '', criterion: '', city: '' })}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucun rapport trouvé.</div>
        ) : (
          <div>
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Critère</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Contributeur</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((r) => (
                  <NeighborhoodReportRow
                    key={r.id}
                    report={r}
                    onFlag={(id) => flag.mutate(id)}
                    onValidate={(id) => validate.mutate(id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNeighborhoodPage;
