import { useState } from 'react';
import { Flag } from 'lucide-react';
import { useAdminReports } from '@/hooks/useAdminReports';
import { useHandleReport } from '@/hooks/useAdminReports';
import ReportRow from '@/components/admin/ReportRow';
import HandleReportModal from '@/components/admin/HandleReportModal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const TABS = [
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours',   label: 'En cours'   },
  { key: 'resolu',     label: 'Résolus'    },
  { key: 'rejete',     label: 'Rejetés'    },
  { key: '',           label: 'Tous'       },
];

const AdminReportsPage = () => {
  const [status, setStatus] = useState('en_attente');
  const [page, setPage] = useState(1);
  const [handleTarget, setHandleTarget] = useState(null);

  const { data, isLoading } = useAdminReports({ status: status || undefined, page });
  const handleReportMut = useHandleReport();

  const reports = data?.data ?? [];
  const meta = data?.meta ?? {};
  const total = meta.total ?? reports.length;
  const pending = data?.meta?.total ?? 0;

  const handleConfirm = (action, adminNote) => {
    handleReportMut.mutate(
      { id: handleTarget.id, data: { action, admin_note: adminNote } },
      { onSuccess: () => setHandleTarget(null) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Flag className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Signalements</h1>
          <p className="text-sm text-gray-500">{total} signalement(s) {status ? `(${TABS.find(t => t.key === status)?.label.toLowerCase()})` : ''}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.key}
            onClick={() => { setStatus(tab.key); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              status === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Flag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucun signalement dans cet onglet</p>
          </div>
        ) : (
          <table className="w-full min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Cible', 'Raison', 'Signalé par', 'Statut', 'Date', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  onHandle={(id) => setHandleTarget(reports.find((r) => r.id === id))}
                />
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

      <HandleReportModal
        isOpen={!!handleTarget}
        onClose={() => setHandleTarget(null)}
        report={handleTarget}
        onConfirm={handleConfirm}
        isLoading={handleReportMut.isPending}
      />
    </div>
  );
};

export default AdminReportsPage;
