import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAdminLogs } from '@/hooks/useAdminLogs';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const AdminLogsPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ action: '', date_from: '', date_to: '' });

  const { data, isLoading } = useAdminLogs({ ...filters, page });
  const logs = data?.data ?? [];
  const meta = data?.meta ?? {};

  const ACTION_COLORS = {
    'user.suspend':    'text-orange-600 bg-orange-50',
    'user.activate':   'text-green-600 bg-green-50',
    'user.delete':     'text-red-600 bg-red-50',
    'property.approve':'text-green-600 bg-green-50',
    'property.reject': 'text-red-600 bg-red-50',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal d'activité</h1>
          <p className="text-xs text-gray-400 mt-0.5">Lecture seule — journal immuable</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={filters.action}
          onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
          placeholder="Filtrer par action..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
        />
        <input
          type="date"
          lang="fr-FR"
          value={filters.date_from}
          onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          lang="fr-FR"
          value={filters.date_to}
          onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucun log trouvé.</div>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Date/Heure', 'Admin', 'Action', 'Cible', 'IP'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {format(new Date(log.created_at), 'd MMM yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.admin?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${ACTION_COLORS[log.action] ?? 'text-gray-600 bg-gray-100'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {log.loggable_type?.split('\\').pop()} #{log.loggable_id}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
          <span className="text-sm text-gray-600">Page {page} / {meta.last_page}</span>
          <Button variant="outline" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
