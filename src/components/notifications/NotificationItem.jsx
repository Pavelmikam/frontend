import { useNavigate } from 'react-router-dom';
import {
  Bell, Check, Trash2, FileText, CheckCircle, XCircle,
  MessageSquare, CheckCircle2, AlertTriangle, Calendar, Search,
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotificationMutations } from '@/hooks/useNotifications';

const ICON_MAP = {
  rental_request_received: { Icon: FileText,      color: 'text-yellow-500', bg: 'bg-yellow-100' },
  rental_request_accepted: { Icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-100'  },
  rental_request_refused:  { Icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-100'    },
  message_received:        { Icon: MessageSquare, color: 'text-blue-500',   bg: 'bg-blue-100'   },
  property_approved:       { Icon: CheckCircle2,  color: 'text-green-600',  bg: 'bg-green-100'  },
  property_rejected:       { Icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100' },
  visit_scheduled:         { Icon: Calendar,      color: 'text-violet-500', bg: 'bg-violet-100' },
  saved_search_match:      { Icon: Search,        color: 'text-blue-600',   bg: 'bg-blue-100'   },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isToday(d))     return format(d, "HH'h'mm", { locale: fr });
  if (isYesterday(d)) return 'Hier';
  return format(d, 'd MMM', { locale: fr });
};

const NotificationItem = ({ notification, onMarkRead, onDelete, compact = false }) => {
  const navigate = useNavigate();
  const { markRead, delete: deleteMut } = useNotificationMutations();

  const iconDef = ICON_MAP[notification.type] ?? { Icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100' };
  const { Icon, color, bg } = iconDef;

  const maxBody = compact ? 80 : 150;
  const body = notification.body?.length > maxBody
    ? notification.body.slice(0, maxBody) + '…'
    : notification.body;

  const handleClick = () => {
    if (!notification.is_read) {
      (onMarkRead ?? (() => markRead.mutate(notification.id)))(notification.id);
    }
    const url = notification.data?.action_url;
    if (url) navigate(url);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    (onMarkRead ?? (() => markRead.mutate(notification.id)))(notification.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    (onDelete ?? (() => deleteMut.mutate(notification.id)))(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-start gap-3 px-3 py-3 rounded-xl transition-colors cursor-pointer ${
        !notification.is_read
          ? 'bg-blue-50 hover:bg-blue-100'
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Icône */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0 pr-8">
        <p className={`text-sm leading-snug ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {notification.title}
        </p>
        {body && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
        )}
        <p className="text-[10px] text-gray-400 mt-1">{formatDate(notification.created_at)}</p>
      </div>

      {/* Point non-lu */}
      {!notification.is_read && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
      )}

      {/* Actions au survol */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-0.5">
        {!notification.is_read && (
          <button
            onClick={handleMarkRead}
            className="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
            title="Marquer comme lu"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
