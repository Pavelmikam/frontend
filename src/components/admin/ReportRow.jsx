import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Building2, MessageSquare } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { REPORT_REASONS, REPORT_STATUSES } from '@/utils/constants';

const StatusBadge = ({ status }) => {
  const def = REPORT_STATUSES.find((s) => s.value === status);
  if (!def) return null;
  const colorMap = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue:   'bg-blue-100   text-blue-800   border-blue-200',
    green:  'bg-green-100  text-green-800  border-green-200',
    gray:   'bg-gray-100   text-gray-600   border-gray-200',
  };
  return (
    <span className={`text-xs font-medium rounded-full border px-2 py-0.5 ${colorMap[def.color] ?? colorMap.gray}`}>
      {def.label}
    </span>
  );
};

const ReportRow = ({ report, onHandle, onView }) => {
  const reasonDef = REPORT_REASONS.find((r) => r.value === report.reason);
  const isProperty = report.reportable_type?.includes('Property');
  const canHandle = ['en_attente', 'en_cours'].includes(report.status);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          {isProperty
            ? <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            : <MessageSquare className="h-4 w-4 text-purple-500 flex-shrink-0" />}
          <span className="font-medium text-gray-800 truncate max-w-[150px]">
            {isProperty ? (report.reportable?.title ?? 'Annonce') : `Message #${report.reportable_id}`}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {reasonDef?.label ?? report.reason}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar src={report.reporter?.avatar_thumb_url} name={report.reporter?.name} size="xs" />
          <span className="text-xs text-gray-600">{report.reporter?.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {format(new Date(report.created_at), 'd MMM yyyy', { locale: fr })}
      </td>
      <td className="px-4 py-3 text-right">
        {canHandle && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onHandle?.(report.id)}
          >
            Traiter
          </Button>
        )}
      </td>
    </tr>
  );
};

export default ReportRow;
