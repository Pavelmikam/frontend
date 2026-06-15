import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationBadge } from '@/hooks/useNotifications';
import UnreadBadge from '@/components/ui/UnreadBadge';
import NotificationDropdown from './NotificationDropdown';

const NotificationBellButton = () => {
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const prevCountRef = useRef(0);

  const { data } = useNotificationBadge();
  const count = data?.count ?? 0;

  // Animation shake quand un nouveau non-lu arrive
  useEffect(() => {
    if (count > prevCountRef.current && prevCountRef.current !== 0) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 ${shake ? 'animate-bounce' : ''}`}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5">
            <UnreadBadge count={count} size="sm" />
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default NotificationBellButton;
