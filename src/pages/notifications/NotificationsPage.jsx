import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationsList, useNotificationMutations, useNotificationBadge } from '@/hooks/useNotifications';
import NotificationItem from '@/components/notifications/NotificationItem';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const FILTERS = [
  { key: 'all',                      label: 'Toutes' },
  { key: 'unread',                   label: 'Non lues' },
  { key: 'rental_request_received',  label: 'Demandes' },
  { key: 'message_received',         label: 'Messages' },
  { key: 'property_approved',        label: 'Annonces' },
  { key: 'visit_scheduled',          label: 'Visites' },
];

const SkeletonRow = () => (
  <div className="flex items-start gap-3 px-4 py-4 animate-pulse border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-2 bg-gray-200 rounded w-full" />
      <div className="h-2 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const params = {
    page,
    ...(activeFilter === 'unread' ? { unread: true } : {}),
    ...(activeFilter !== 'all' && activeFilter !== 'unread' ? { type: activeFilter } : {}),
  };

  const { data, isLoading } = useNotificationsList(params);
  const { markAllRead } = useNotificationMutations();
  const { data: badgeData } = useNotificationBadge();

  const notifications = data?.data ?? [];
  const meta = data?.meta ?? {};
  const unreadCount = badgeData?.count ?? 0;
  const lastPage = meta.last_page ?? 1;

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setPage(1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} non lue(s)</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer lu
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              {activeFilter === 'unread'
                ? 'Aucune notification non lue ✓'
                : 'Aucune notification pour l\'instant'}
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notif, idx) => (
              <div key={notif.id} className={idx < notifications.length - 1 ? 'border-b border-gray-100' : ''}>
                <NotificationItem notification={notif} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Précédent
          </Button>
          <span className="text-sm text-gray-600">Page {page} sur {lastPage}</span>
          <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
