import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Building2, Users, BarChart2, Globe, Lock, Unlock, CheckCircle } from 'lucide-react';
import useMyProperties from '@/hooks/useMyProperties';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import PropertyStatusBadge from '@/components/ui/PropertyStatusBadge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { formatPrice, formatSurface } from '@/utils/formatters';
import { ROUTES, PROPERTY_STATUSES } from '@/utils/constants';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  ...PROPERTY_STATUSES.map((s) => ({ value: s.value, label: s.label })),
];

const MyPropertiesPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null); // { property, toStatus }
  const [error, setError] = useState('');

  const { data, isLoading } = useMyProperties({ page, status: statusFilter || undefined });
  const { deleteProperty, updatePropertyStatus, submitProperty } = usePropertyMutations();

  const properties = data?.data ?? [];
  const meta = data?.meta ?? {};
  const lastPage = meta.last_page ?? 1;

  // KPIs
  const total = meta.total ?? properties.length;
  const available = properties.filter((p) => p.status === 'active').length;
  const drafts = properties.filter((p) => p.status === 'draft').length;
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
    if (!statusTarget) return;
    setError('');
    try {
      await updatePropertyStatus.mutateAsync({ id: statusTarget.property.id, status: statusTarget.toStatus });
      setStatusTarget(null);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la mise à jour du statut.');
    }
  };

  const STATUS_ACTIONS = {
    active: [
      { toStatus: 'sous_reservation', label: 'Réserver', icon: Lock, color: 'text-orange-600 border-orange-300 hover:bg-orange-50', confirmLabel: 'Passer sous réservation', confirmDesc: "L'annonce ne sera plus visible dans les recherches. Les locataires intéressés pourront toujours y accéder via leur candidature ou lien direct." },
      { toStatus: 'loue', label: 'Loué', icon: CheckCircle, color: 'text-blue-600 border-blue-300 hover:bg-blue-50', confirmLabel: 'Marquer comme loué', confirmDesc: "L'annonce sera retirée des recherches publiques et marquée comme louée." },
    ],
    sous_reservation: [
      { toStatus: 'active', label: 'Disponible', icon: Unlock, color: 'text-green-600 border-green-300 hover:bg-green-50', confirmLabel: 'Remettre disponible', confirmDesc: "L'annonce sera de nouveau visible dans les recherches publiques." },
      { toStatus: 'loue', label: 'Loué', icon: CheckCircle, color: 'text-blue-600 border-blue-300 hover:bg-blue-50', confirmLabel: 'Confirmer la location', confirmDesc: "L'annonce sera retirée des recherches publiques et marquée comme louée." },
    ],
    loue: [
      { toStatus: 'active', label: 'Disponible', icon: Unlock, color: 'text-green-600 border-green-300 hover:bg-green-50', confirmLabel: 'Remettre disponible', confirmDesc: "L'annonce sera de nouveau visible dans les recherches publiques." },
    ],
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
            { label: 'Publiées', value: available, color: 'green' },
            { label: 'Brouillons', value: drafts, color: 'yellow' },
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
                  {/* Image */}
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

                  {/* Statut + nom + description + vues */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-1">
                      <PropertyStatusBadge status={property.status} />
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
                    {property.requests_count > 0 && (
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

                  {/* Actions — extrême droite, grille 2 colonnes compacte */}
                  <div className="flex-shrink-0 grid grid-cols-2 gap-0.5 self-start">
                    <Link to={`${ROUTES.ANNONCES}/${property.id}`}>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none">
                        <Eye className="h-3.5 w-3.5" /> Voir
                      </Button>
                    </Link>

                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/modifier`}>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none">
                        <Pencil className="h-3.5 w-3.5" /> Modifier
                      </Button>
                    </Link>

                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/stats`} className="col-span-2">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none text-purple-600 border-purple-200 hover:bg-purple-50">
                        <BarChart2 className="h-3.5 w-3.5" /> Statistiques
                      </Button>
                    </Link>

                    {property.status === 'draft' && (
                      <Button
                        variant="outline"
                        className="col-span-2 flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() => setSubmitTarget(property)}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Publier
                      </Button>
                    )}

                    {(STATUS_ACTIONS[property.status] ?? []).map((action) => (
                      <Button
                        key={action.toStatus}
                        variant="outline"
                        className={`flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none ${action.color}`}
                        onClick={() => setStatusTarget({ property, toStatus: action.toStatus, ...action })}
                      >
                        <action.icon className="h-3.5 w-3.5" />
                        {action.label}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      className="col-span-2 flex items-center justify-center gap-1 py-1 px-2 text-xs leading-none text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => setDeleteTarget(property)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
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

      {/* Publish modal */}
      <Modal
        isOpen={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        title="Publier l'annonce"
      >
        <p className="text-sm text-gray-600 mb-6">
          Publier <strong>{submitTarget?.title}</strong> ? Elle sera immédiatement visible par tous les locataires.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setSubmitTarget(null)}>Annuler</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitProperty.isPending}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {submitProperty.isPending ? 'Publication...' : 'Publier'}
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

      {/* Status confirmation modal */}
      <Modal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title={statusTarget?.confirmLabel ?? 'Modifier le statut'}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {statusTarget?.confirmDesc}
          </p>
          <p className="text-sm font-medium text-gray-800">
            Annonce : <strong>{statusTarget?.property?.title}</strong>
          </p>
          {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStatusTarget(null)}>Annuler</Button>
            <Button
              variant="primary"
              onClick={handleStatusChange}
              disabled={updatePropertyStatus.isPending}
            >
              {updatePropertyStatus.isPending ? 'Mise à jour...' : 'Confirmer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPropertiesPage;
