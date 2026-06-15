import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { ArrowLeft, UserX, UserCheck, Trash2, RotateCcw } from 'lucide-react';
import { useAdminUser, useAdminUserMutations } from '@/hooks/useAdminUsers';
import SuspendUserModal from '@/components/admin/SuspendUserModal';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar_url} name={user.name} size="xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <Badge role={user.role} />
              </div>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Inscrit le {format(new Date(user.created_at), 'd MMMM yyyy', { locale: fr })}
              </p>
              <div className="mt-1">
                {user.deleted_at ? (
                  <span className="text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-full px-2 py-0.5">Supprimé</span>
                ) : !user.is_active ? (
                  <span className="text-xs font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-full px-2 py-0.5">Suspendu</span>
                ) : (
                  <span className="text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">Actif</span>
                )}
              </div>
            </div>
          </div>

          {!isAdmin && !user.deleted_at && (
            <div className="flex gap-2">
              {user.is_active ? (
                <Button variant="outline" size="sm" onClick={() => setSuspendOpen(true)}
                  className="flex items-center gap-1.5 text-orange-600 border-orange-300">
                  <UserX className="h-4 w-4" /> Suspendre
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => activate.mutate(user.id)}
                  className="flex items-center gap-1.5 text-green-600 border-green-300">
                  <UserCheck className="h-4 w-4" /> Réactiver
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            </div>
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Annonces',      value: user.properties_count ?? 0 },
          { label: 'Candidatures',  value: user.rental_requests_count ?? 0 },
          { label: 'Conversations', value: user.conversations_count ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

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
