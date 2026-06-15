import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, ExternalLink } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ReportButton from '@/components/admin/ReportButton';

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const MessageBubble = ({ message, isOwn }) => {
  // Message système : centré, fond gris léger
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs italic text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {message.body}
        </span>
      </div>
    );
  }

  const sender = message.sender ?? {};
  const attachments = message.attachments ?? [];
  const timeLabel = message.created_at
    ? format(new Date(message.created_at), "HH'h'mm", { locale: fr })
    : '';

  return (
    <div className={`group flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (seulement pour les messages des autres) */}
      {!isOwn && (
        <div className="flex-shrink-0 self-end mb-1">
          <Avatar src={sender.avatar_thumb_url} name={sender.name} size="sm" />
        </div>
      )}

      <div className={`max-w-[72%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Texte */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isOwn
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
          }`}
        >
          {message.body}
        </div>

        {/* Pièces jointes */}
        {attachments.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            {attachments.map((att, idx) => (
              att.attachment_type === 'image' ? (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden max-w-[200px]"
                >
                  <img
                    src={att.url}
                    alt={att.original_name ?? 'Image'}
                    className="w-full rounded-lg hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-colors ${
                    isOwn
                      ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-400'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate max-w-[150px]">{att.original_name}</span>
                  {att.file_size && (
                    <span className="opacity-70 flex-shrink-0">{formatFileSize(att.file_size)}</span>
                  )}
                  <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70" />
                </a>
              )
            ))}
          </div>
        )}

        {/* Heure + signalement */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">{timeLabel}</span>
          {!isOwn && (
            <ReportButton
              type="message"
              targetId={message.id}
              ownerId={sender.id}
              className="opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
        {/* ⚠️ Aucun bouton modifier/supprimer — messages immuables */}
      </div>
    </div>
  );
};

export default MessageBubble;
