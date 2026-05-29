import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPendingProperties } from '@/api/property.api';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import PropertyApprovalBadge from '@/components/ui/PropertyApprovalBadge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { formatPrice, formatSurface } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const PendingPropertiesPage = () => {
  const [page, setPage] = useState(1);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pendingProperties', page],
    queryFn: () => getPendingProperties({ page }),
  });

  const { moderateProperty } = usePropertyMutations();

  const properties = data?.data ?? [];
  const meta = data?.meta ?? {};
  const lastPage = meta.last_page ?? 1;

  const handleApprove = async () => {
    setError('');
    try {
      await moderateProperty.mutateAsync({ id: approveTarget.id, data: { action: 'approve' } });
      setApproveTarget(null);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de l\'approbation.');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setError('');
    try {
      await moderateProperty.mutateAsync({
        id: rejectTarget.id,
        data: { action: 'reject', rejection_reason: rejectionReason.trim() },
      });
      setRejectTarget(null);
      setRejectionReason('');
    } catch (e) {
      setError(e.userMessage || 'Erreur lors du rejet.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Modération des annonces</h1>
          <p className="text-sm text-gray-500 mt-1">
            Annonces en attente d'approbation
            {meta.total != null && ` (${meta.total})`}
          </p>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} className="mb-4" />}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p className="font-medium">Aucune annonce en attente</p>
            <p className="text-sm mt-1">Toutes les annonces ont été traitées.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => {
              const thumb = property.images?.find((i) => i.is_primary) ?? property.images?.[0];
              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumb ? (
                      <img
                        src={thumb.thumbnail_url || thumb.optimized_url}
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
                    <div className="mb-1">
                      <PropertyApprovalBadge isApproved={property.is_approved} />
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''} •{' '}
                      {formatPrice(property.price)} • {formatSurface(property.surface)}
                    </p>
                    {property.owner && (
                      <p className="text-xs text-gray-400 mt-1">
                        Par {property.owner.first_name} {property.owner.last_name}
                        {property.owner.email && ` · ${property.owner.email}`}
                      </p>
                    )}
                    {property.created_at && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Soumis le {new Date(property.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <Link to={`${ROUTES.ANNONCES}/${property.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Voir
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => setApproveTarget(property)}
                    >
                      <CheckCircle className="h-4 w-4" /> Approuver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => { setRejectTarget(property); setRejectionReason(''); }}
                    >
                      <XCircle className="h-4 w-4" /> Rejeter
                    </Button>
                  </div>
                </div>
              );
            })}
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

      {/* Approve modal */}
      <Modal isOpen={!!approveTarget} onClose={() => setApproveTarget(null)} title="Approuver l'annonce">
        <p className="text-sm text-gray-600 mb-6">
          Approuver <strong>{approveTarget?.title}</strong> ? Elle sera visible par tous les visiteurs.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setApproveTarget(null)}>Annuler</Button>
          <Button
            variant="primary"
            onClick={handleApprove}
            disabled={moderateProperty.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {moderateProperty.isPending ? 'Approbation...' : 'Approuver'}
          </Button>
        </div>
      </Modal>

      {/* Reject modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectionReason(''); }} title="Rejeter l'annonce">
        <p className="text-sm text-gray-600 mb-3">
          Rejeter <strong>{rejectTarget?.title}</strong>. Veuillez indiquer la raison :
        </p>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
          rows={4}
          placeholder="Raison du rejet (obligatoire)"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionReason(''); }}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={moderateProperty.isPending || !rejectionReason.trim()}
          >
            {moderateProperty.isPending ? 'Rejet...' : 'Rejeter'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PendingPropertiesPage;
