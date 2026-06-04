import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Avatar from '@/components/ui/Avatar';

const Bubble = ({ author, text, date, align = 'left' }) => (
  <div className={`flex gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
    <div className="flex-shrink-0">
      <Avatar name={author} size="sm" />
    </div>
    <div className={`max-w-[75%] ${align === 'right' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
      <span className="text-xs text-gray-500 font-medium">{author}</span>
      <div
        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          align === 'right'
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}
      >
        {text}
      </div>
      {date && (
        <span className="text-xs text-gray-400">
          {format(new Date(date), "d MMM yyyy 'à' HH'h'mm", { locale: fr })}
        </span>
      )}
    </div>
  </div>
);

const RequestMessageThread = ({ request }) => {
  const tenantName = request?.tenant?.name ?? 'Locataire';
  const ownerName = request?.property?.owner?.name ?? 'Propriétaire';

  const hasMessage = !!request?.message;
  const hasResponse = !!request?.owner_response;

  if (!hasMessage && !hasResponse) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Messages</h3>
        </div>
        <p className="text-sm text-gray-400 italic">Aucun message pour cette candidature.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-semibold text-gray-900">Messages</h3>
      </div>

      <div className="space-y-4">
        {hasMessage && (
          <Bubble
            author={tenantName}
            text={request.message}
            date={request.created_at}
            align="left"
          />
        )}

        {hasResponse && (
          <Bubble
            author={ownerName}
            text={request.owner_response}
            date={request.decided_at}
            align="right"
          />
        )}
      </div>
    </div>
  );
};

export default RequestMessageThread;
