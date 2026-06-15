import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Archive } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import UnreadBadge from '@/components/ui/UnreadBadge';

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Hier';
  return format(date, 'd MMM', { locale: fr });
};

const ConversationCard = ({ conversation, isActive = false, onClick }) => {
  const other = conversation.other_participant ?? {};
  const property = conversation.property ?? {};
  const preview = conversation.last_message_preview ?? '';
  const shortPreview = preview.length > 60 ? preview.slice(0, 60) + '…' : preview;

  return (
    <div
      onClick={() => onClick?.(conversation.id)}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-50 border border-blue-200 shadow-sm'
          : 'hover:bg-gray-50 border border-transparent'
      } ${conversation.is_archived ? 'opacity-60' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={other.avatar_thumb_url} name={other.name} size="md" />
        {conversation.unread_count > 0 && (
          <span className="absolute -top-0.5 -right-0.5">
            <UnreadBadge count={conversation.unread_count} size="sm" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-semibold text-gray-900 truncate">{other.name}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {conversation.is_archived && (
              <Archive className="h-3 w-3 text-gray-400" />
            )}
            <span className="text-xs text-gray-400">
              {formatRelativeDate(conversation.last_message_at)}
            </span>
          </div>
        </div>

        {property.title && (
          <p className="text-xs text-blue-600 truncate mb-0.5">{property.title}</p>
        )}

        <p className={`text-xs truncate ${
          conversation.unread_count > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'
        }`}>
          {shortPreview || <span className="italic">Aucun message</span>}
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;
