import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import {
  ArrowLeft, UserX, UserCheck, Trash2, RotateCcw,
  Phone, MapPin, FileText, MessageSquare, CheckCircle, XCircle,
  Building2, Users, Flag,
} from 'lucide-react';
import { useAdminUser, useAdminUserMutations } from '@/hooks/useAdminUsers';
import SuspendUserModal from '@/components/admin/SuspendUserModal';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StatusBadge = ({ user }) => {
  if (user.deleted_at) return (
    <span className="text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-full px-2.5 py-1">Supprimé</span>
  );
  if (!user.is_active) return (
    <span className="text-xs font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-full px-2.5 py-1">Suspendu</span>
  );
  return (
    <span className="text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full px-2.5 py-1">Actif</span>
  );
};

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useAdminUser(Number(id));
  const { suspend, activate, delete: deleteMut, restore } = useAdminUserMutations();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const user = data?.data ?? data;

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (!user) return <div className="text-center py-12 text-gray-500">Utilisateur introuvable.</div>;

  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-3xl space-y-6">
      <Link to={ROUTES.ADMIN_UTILISATEURS} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Retour aux utilisateurs
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar src={user.avatar_url} name={user.name} size="xl" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <Badge role={user.role} />
                <StatusBadge user={user} />
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>

              {/* Extra profile fields */}
              {user.phone && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {user.phone}
                </p>
              )}
              {user.city && (
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {user.city}
                </p>
              )}

              {/* Dates */}
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-gray-400">
                  Inscrit le {format(new Date(user.created_at), 'd MMMM yyyy', { locale: fr })}
                </p>
                {user.deleted_at && (
                  <p className="text-xs text-red-400">
                    Supprimé le {format(new Date(user.deleted_at), 'd MMMM yyyy', { locale: fr })}
                  </p>
                )}
              </div>

              {/* Email verification */}
              <div className="mt-2 flex items-center gap-1.5">
                {user.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3.5 w-3.5" /> Email vérifié
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-orange-500">
                    <XCircle className="h-3.5 w-3.5" /> Email non vérifié
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            {!isAdmin && !user.deleted_at && (
              <>
                {user.is_active ? (
                  <Button variant="outline" size="sm" onClick={() => setSuspendOpen(true)}
                    className="flex items-center gap-1.5 text-orange-600 border-orange-300">
                    <UserX className="h-4 w-4" /> Suspendre
                  </Button>
                ) : (
                  <Button variant="outline" size="sm"
                    onClick={() => activate.mutate(user.id)}
                    disabled={activate.isPending}
                    className="flex items-center gap-1.5 text-green-600 border-green-300">
                    <UserCheck className="h-4 w-4" />
                    {activate.isPending ? 'Réactivation...' : 'Réactiver'}
                  </Button>
                )}
                <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-1.5">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </Button>
              </>
            )}
            {user.deleted_at && (
              <Button variant="outline" size="sm"
                onClick={() => restore.mutate(user.id)}
                disabled={restore.isPending}
                className="flex items-center gap-1.5 text-blue-600 border-blue-300">
                <RotateCcw className="h-4 w-4" />
                {restore.isPending ? 'Restauration...' : 'Restaurer le compte'}
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 italic">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Annonces',      value: user.properties_count ?? 0,      Icon: Building2,      color: 'blue'   },
          { label: 'Candidatures',  value: user.rental_requests_count ?? 0, Icon: Users,          color: 'green'  },
          { label: 'Signalements',  value: user.reports_count ?? 0,         Icon: Flag,           color: 'orange' },
          { label: 'Conversations', value: user.conversations_count ?? 0,   Icon: MessageSquare,  color: 'purple' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-1 text-${color}-500`} />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Modals */}
      <SuspendUserModal
        isOpen={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        user={user}
        onConfirm={(reason) => suspend.mutate({ id: user.id, reason }, { onSuccess: () => setSuspendOpen(false) })}
        isLoading={suspend.isPending}
      />

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Supprimer l'utilisateur">
        <p className="text-sm text-gray-600 mb-6">
          Supprimer définitivement <strong>{user.name}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button variant="danger" disabled={deleteMut.isPending}
            onClick={() => deleteMut.mutate(user.id, { onSuccess: () => setDeleteOpen(false) })}>
            {deleteMut.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserDetailPage;
