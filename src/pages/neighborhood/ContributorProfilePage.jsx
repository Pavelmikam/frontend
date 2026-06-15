import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { useMyContributorProfile, useMyNeighborhoodReports } from '@/hooks/useNeighborhoodScore';
import useAuth from '@/hooks/useAuth';
import { CONTRIBUTOR_BADGES, NEIGHBORHOOD_CRITERIA } from '@/utils/constants';
import ContributorPointsBar from '@/components/neighborhood/ContributorPointsBar';
import ContributorBadgeDisplay from '@/components/neighborhood/ContributorBadgeDisplay';
import NeighborhoodReportModal from '@/components/neighborhood/NeighborhoodReportModal';
import Spinner from '@/components/ui/Spinner';

const ContributorProfilePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { data: profile, isLoading: profileLoading } = useMyContributorProfile();
  const { data: reportsData, isLoading: reportsLoading } = useMyNeighborhoodReports();

  const reports = reportsData?.data ?? [];

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const points = profile?.contributor_points ?? 0;
  const badges = profile?.badges ?? [];
  const reportsCount = profile?.reports_count ?? 0;

  // Stats
  const uniqueZones = [...new Set(reports.map((r) => `${r.city}__${r.neighborhood}`))].length;
  const criteriaCounts = {};
  reports.forEach((r) => { criteriaCounts[r.criterion] = (criteriaCounts[r.criterion] ?? 0) + 1; });
  const topCriterion = Object.entries(criteriaCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCriterionMeta = NEIGHBORHOOD_CRITERIA.find((c) => c.value === topCriterion);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
              {user?.name?.[0] ?? '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <ContributorPointsBar points={points} />
          <ContributorBadgeDisplay badges={badges} size="md" showAll={false} />
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(CONTRIBUTOR_BADGES).map(([key, badge]) => {
              const obtained = badges.includes(key);
              return (
                <div
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    obtained
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Évaluations',   value: reportsCount },
            { label: 'Zones uniques', value: uniqueZones },
            { label: 'Points',        value: points },
            { label: 'Critère n°1',   value: topCriterionMeta ? `${topCriterionMeta.icon} ${topCriterionMeta.label}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Mes évaluations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Mes évaluations</h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              + Évaluer un quartier
            </button>
          </div>

          {reportsLoading ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : reports.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune évaluation pour l'instant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Critère</th>
                    <th className="pb-2 font-medium">Note</th>
                    <th className="pb-2 font-medium">Zone</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => {
                    const c = NEIGHBORHOOD_CRITERIA.find((x) => x.value === r.criterion);
                    return (
                      <tr key={r.id} className="border-b border-gray-50">
                        <td className="py-2.5">
                          <span className="mr-1">{c?.icon}</span>{c?.label ?? r.criterion}
                        </td>
                        <td className="py-2.5">
                          <div className="flex">
                            {[1,2,3,4,5].map((n) => (
                              <Star key={n} className={`h-3.5 w-3.5 ${n <= r.score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 text-gray-600">
                          {[r.neighborhood, r.city].filter(Boolean).join(', ')}
                        </td>
                        <td className="py-2.5 text-gray-400 text-xs">
                          {r.created_at
                            ? formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: fr })
                            : '—'}
                        </td>
                        <td className="py-2.5">
                          {r.is_validated ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Validé</span>
                          ) : (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">En attente</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NeighborhoodReportModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ContributorProfilePage;
