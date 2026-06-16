import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Users, Search } from 'lucide-react';
import { useAdminUsers, useAdminUserMutations } from '@/hooks/useAdminUsers';
import UserRow from '@/components/admin/UserRow';
import SuspendUserModal from '@/components/admin/SuspendUserModal';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';

const ROLE_OPTIONS = [
  { value: '', label: 'Tous les rôles' },
  { value: 'locataire',    label: 'Locataire' },
  { value: 'proprietaire', label: 'Propriétaire' },
];

const STATUS_OPTIONS = [
  { value: '',          label: 'Tous les statuts' },
  { value: 'active',    label: 'Actifs' },
  { value: 'suspended', label: 'Suspendus' },
  { value: 'deleted',   label: 'Supprimés' },
];

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [page, setPage] = useState(1);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminUsers({ ...filters, page });
  const { suspend, activate, delete: deleteMut, restore } = useAdminUserMutations();

  const users = data?.data ?? [];
  const meta = data?.meta ?? {};
  const total = meta.total ?? users.length;

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-sm text-gray-500">{total} utilisateur(s)</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Rechercher nom ou email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            options={ROLE_OPTIONS}
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Erreur lors du chargement</p>
            <p className="text-sm text-gray-400 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Utilisateur', 'Rôle', 'Statut', 'Inscription', 'Annonces/Candidatures', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={(id) => navigate(ROUTES.ADMIN_UTILISATEUR(id))}
                  onSuspend={(id) => setSuspendTarget(users.find((u) => u.id === id))}
                  onActivate={(id) => activate.mutate(id)}
                  onDelete={(id) => setDeleteTarget(users.find((u) => u.id === id))}
                  onRestore={(id) => restore.mutate(id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
          <span className="text-sm text-gray-600">Page {page} / {meta.last_page}</span>
          <Button variant="outline" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
        </div>
      )}

      {/* Modals */}
      <SuspendUserModal
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        user={suspendTarget}
        onConfirm={(reason) => {
          suspend.mutate({ id: suspendTarget.id, reason }, { onSuccess: () => setSuspendTarget(null) });
        }}
        isLoading={suspend.isPending}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Supprimer l'utilisateur">
        <p className="text-sm text-gray-600 mb-6">
          Supprimer définitivement <strong>{deleteTarget?.name}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
          <Button
            variant="danger"
            disabled={deleteMut.isPending}
            onClick={() => deleteMut.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          >
            {deleteMut.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
