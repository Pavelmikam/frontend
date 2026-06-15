import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationsList, useNotificationMutations, useNotificationBadge } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

const SkeletonLine = () => (
  <div className="flex items-start gap-3 px-3 py-3 animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-2 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

const NotificationDropdown = ({ isOpen, onClose }) => {
  const ref = useRef(null);
  const { data: badgeData } = useNotificationBadge();
  const unreadCount = badgeData?.count ?? 0;

  const { data, isLoading } = useNotificationsList({ per_page: 5 });
  const { markAllRead } = useNotificationMutations();
  const notifications = data?.data ?? [];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1.5 text-xs font-bold text-blue-600">
                ({unreadCount} non lues)
              </span>
            )}
          </span>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tout lire
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => <SkeletonLine key={i} />)}
          </>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Voir toutes les notifications →
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
