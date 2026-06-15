import { Flag, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NEIGHBORHOOD_CRITERIA } from '@/utils/constants';

const NeighborhoodReportRow = ({ report, onFlag, onValidate }) => {
  const criterion = NEIGHBORHOOD_CRITERIA.find((c) => c.value === report.criterion);

  const timeAgo = report.created_at
    ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: fr })
    : '—';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{criterion?.icon ?? '📍'}</span>
          <span className="text-sm font-medium text-gray-800">{criterion?.label ?? report.criterion}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`text-sm ${n <= report.score ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {[report.neighborhood, report.city].filter(Boolean).join(', ')}
      </td>
      <td className="px-4 py-3">
        {report.contributor ? (
          <span className="text-sm text-gray-700">{report.contributor.name}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {report.is_flagged ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
            <Flag className="h-3 w-3" /> Suspect
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
            <CheckCircle className="h-3 w-3" /> Validé
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{timeAgo}</td>
      <td className="px-4 py-3">
        {report.is_flagged ? (
          <button
            onClick={() => onValidate?.(report.id)}
            className="text-xs text-green-600 hover:underline font-medium"
          >
            Revalider
          </button>
        ) : (
          <button
            onClick={() => onFlag?.(report.id)}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Signaler suspect
          </button>
        )}
      </td>
    </tr>
  );
};

export default NeighborhoodReportRow;
