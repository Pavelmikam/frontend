import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, UserX, UserCheck, Trash2, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const StatusBadge = ({ user }) => {
  if (user.deleted_at) return (
    <span className="text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-full px-2 py-0.5">Supprimé</span>
  );
  if (!user.is_active) return (
    <span className="text-xs font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-full px-2 py-0.5">Suspendu</span>
  );
  return (
    <span className="text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">Actif</span>
  );
};

const UserRow = ({ user, onSuspend, onActivate, onDelete, onRestore, onView }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar_url} name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate text-sm">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge role={user.role} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge user={user} />
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {format(new Date(user.created_at), 'd MMM yyyy', { locale: fr })}
      </td>
      <td className="px-4 py-3 text-center text-xs text-gray-600">
        {user.properties_count ?? 0} / {user.rental_requests_count ?? 0}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
              <button onClick={() => { onView?.(user.id); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Eye className="h-4 w-4" /> Voir le profil
              </button>
              {!isAdmin && user.is_active && !user.deleted_at && (
                <button onClick={() => { onSuspend?.(user.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-50">
                  <UserX className="h-4 w-4" /> Suspendre
                </button>
              )}
              {!isAdmin && !user.is_active && !user.deleted_at && (
                <button onClick={() => { onActivate?.(user.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50">
                  <UserCheck className="h-4 w-4" /> Réactiver
                </button>
              )}
              {!isAdmin && !user.deleted_at && (
                <button onClick={() => { onDelete?.(user.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              )}
              {user.deleted_at && (
                <button onClick={() => { onRestore?.(user.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                  <RotateCcw className="h-4 w-4" /> Restaurer
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
