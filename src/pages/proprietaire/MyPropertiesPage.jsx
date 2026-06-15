import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Building2, Users, BarChart2, Send } from 'lucide-react';
import useMyProperties from '@/hooks/useMyProperties';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import PropertyStatusBadge from '@/components/ui/PropertyStatusBadge';
import PropertyApprovalBadge from '@/components/ui/PropertyApprovalBadge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';
import { formatPrice, formatSurface } from '@/utils/formatters';
import { ROUTES, PROPERTY_STATUSES, OWNER_SETTABLE_STATUSES } from '@/utils/constants';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  ...PROPERTY_STATUSES.map((s) => ({ value: s.value, label: s.label })),
];

const MyPropertiesPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useMyProperties({ page, status: statusFilter || undefined });
  const { deleteProperty, updatePropertyStatus, submitProperty } = usePropertyMutations();

  const properties = data?.data ?? [];
  const meta = data?.meta ?? {};
  const lastPage = meta.last_page ?? 1;

  // KPIs
  const total = meta.total ?? properties.length;
  const available = properties.filter((p) => p.status === 'active').length;
  const pending = properties.filter((p) => p.status === 'pending').length;
  const views = properties.reduce((sum, p) => sum + (p.views_count ?? 0), 0);

  const handleDelete = async () => {
    setError('');
    try {
      await deleteProperty.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la suppression.');
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    setError('');
    try {
      await updatePropertyStatus.mutateAsync({ id: statusTarget.id, status: newStatus });
      setStatusTarget(null);
      setNewStatus('');
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la mise à jour du statut.');
    }
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await submitProperty.mutateAsync(submitTarget.id);
      setSubmitTarget(null);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la soumission.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes annonces</h1>
            <p className="text-sm text-gray-500 mt-1">Gérez vos biens immobiliers</p>
          </div>
          <Link to={ROUTES.MES_ANNONCES_CREER}>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Déposer une annonce
            </Button>
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total annonces', value: total, color: 'blue' },
            { label: 'Disponibles', value: available, color: 'green' },
            { label: 'En attente', value: pending, color: 'yellow' },
            { label: 'Vues totales', value: views, color: 'purple' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="w-full sm:w-48">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} className="mb-4" />}

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune annonce trouvée</p>
            <p className="text-sm mt-1">
              {statusFilter ? 'Essayez un autre filtre.' : 'Créez votre première annonce.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {property.thumbnail_url ? (
                      <img
                        src={property.thumbnail_url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-1">
                      <PropertyStatusBadge status={property.status} />
                      <PropertyApprovalBadge status={property.status} rejectionReason={property.rejection_reason} />
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''} •{' '}
                      {formatPrice(property.price)} • {formatSurface(property.surface)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {property.views_count ?? 0} vue(s)
                      {property.views_count > 0 && property.requests_count > 0 && (
                        <span className="ml-2 text-blue-500">
                          · {((property.requests_count / property.views_count) * 100).toFixed(1)}% conv.
                        </span>
                      )}
                    </p>
                    {(property.requests_count > 0) && (
                      <Link
                        to={`${ROUTES.MES_ANNONCES}/${property.id}/candidatures`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Users className="h-3 w-3" />
                        {property.requests_count} candidature(s) en attente
                      </Link>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <Link to={`${ROUTES.ANNONCES}/${property.id}`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Voir
                      </Button>
                    </Link>
                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/stats`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-purple-600 hover:text-purple-700">
                        <BarChart2 className="h-4 w-4" /> Stats
                      </Button>
                    </Link>
                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/candidatures`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                        <Users className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/modifier`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Pencil className="h-4 w-4" /> Modifier
                      </Button>
                    </Link>
                    {(property.status === 'draft' || property.status === 'rejected') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => setSubmitTarget(property)}
                      >
                        <Send className="h-4 w-4" />
                        {property.status === 'rejected' ? 'Resoumettre' : 'Soumettre'}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      onClick={() => { setStatusTarget(property); setNewStatus(property.status); }}
                    >
                      Statut
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(property)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
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

      {/* Submit modal */}
      <Modal
        isOpen={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        title={submitTarget?.status === 'rejected' ? "Resoumettre pour validation" : "Soumettre pour validation"}
      >
        <p className="text-sm text-gray-600 mb-6">
          {submitTarget?.status === 'rejected'
            ? <>Resoumettre <strong>{submitTarget?.title}</strong> après correction ? L'administrateur la réexaminera.</>
            : <>Soumettre <strong>{submitTarget?.title}</strong> pour validation par l'administrateur ? Elle sera visible publiquement une fois approuvée.</>
          }
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setSubmitTarget(null)}>Annuler</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitProperty.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {submitProperty.isPending
              ? (submitTarget?.status === 'rejected' ? 'Resoumission...' : 'Soumission...')
              : (submitTarget?.status === 'rejected' ? 'Resoumettre' : 'Soumettre')
            }
          </Button>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Supprimer l'annonce">
        <p className="text-sm text-gray-600 mb-6">
          Supprimer <strong>{deleteTarget?.title}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteProperty.isPending}>
            {deleteProperty.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </Modal>

      {/* Status modal */}
      <Modal isOpen={!!statusTarget} onClose={() => { setStatusTarget(null); setNewStatus(''); }} title="Changer le statut">
        <p className="text-sm text-gray-600 mb-4">
          Modifier le statut de <strong>{statusTarget?.title}</strong>
        </p>
        <Select
          label="Nouveau statut"
          options={OWNER_SETTABLE_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => { setStatusTarget(null); setNewStatus(''); }}>Annuler</Button>
          <Button variant="primary" onClick={handleStatusChange} disabled={updatePropertyStatus.isPending || !newStatus}>
            {updatePropertyStatus.isPending ? 'Mise à jour...' : 'Confirmer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyPropertiesPage;
