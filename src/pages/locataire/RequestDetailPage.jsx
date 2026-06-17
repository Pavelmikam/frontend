import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, ExternalLink } from 'lucide-react';
import { useRentalRequest, useRentalRequestMutations } from '@/hooks/useRentalRequests';
import useAuth from '@/hooks/useAuth';
import RentalStatusBadge from '@/components/ui/RentalStatusBadge';
import RequestMessageThread from '@/components/rental/RequestMessageThread';
import VisitScheduler from '@/components/rental/VisitScheduler';
import DossierLocatif from '@/components/rental/DossierLocatif';
import DecideRequestModal from '@/components/rental/DecideRequestModal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useRentalRequest(Number(id));
  const { cancel, decide, scheduleVisit, confirmVisit } = useRentalRequestMutations();

  const [decideModal, setDecideModal] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const request = data?.data ?? data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <Building2 className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">Candidature introuvable</p>
        <Link to={ROUTES.MES_CANDIDATURES} className="mt-4 text-blue-600 hover:underline text-sm">
          Retour aux candidatures
        </Link>
      </div>
    );
  }

  const viewAs = user?.id === request?.tenant?.id ? 'tenant' : 'owner';
  const property = request.property ?? {};
  const canEdit = viewAs === 'tenant' && request.status === 'en_attente';
  const isAdmin = user?.role === 'admin';

  const backPath = viewAs === 'tenant' ? ROUTES.MES_CANDIDATURES : ROUTES.MES_ANNONCES_CANDIDATURES(property.id);
  const backLabel = viewAs === 'tenant' ? '← Mes candidatures' : '← Demandes reçues';

  const formattedDate = request.created_at
    ? format(new Date(request.created_at), "d MMMM yyyy", { locale: fr })
    : '';

  const handleDecideConfirm = (action, ownerResponse) => {
    decide.mutate(
      { id: request.id, data: { action, owner_response: ownerResponse } },
      { onSuccess: () => setDecideModal(null) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to={backPath} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Candidature pour {property.title ?? 'ce bien'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Postulé le {formattedDate}</p>
            </div>
            <RentalStatusBadge status={request.status} size="md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Bien concerné</h2>
              <div className="flex gap-4">
                <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {property.thumbnail_url ? (
                    <img src={property.thumbnail_url} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Building2 className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{property.title}</p>
                  <p className="text-sm text-gray-500">{property.city}</p>
                  {property.price && (
                    <p className="text-sm font-medium text-blue-700 mt-1">{formatPrice(property.price)}</p>
                  )}
                </div>
              </div>
              {property.id && (
                <Link
                  to={`${ROUTES.ANNONCES}/${property.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voir l'annonce
                </Link>
              )}
            </div>

            {/* Messages */}
            <RequestMessageThread request={request} />

            {/* Visit */}
            <VisitScheduler
              request={request}
              viewAs={viewAs}
              onSchedule={(date) => scheduleVisit.mutate({ id: request.id, visitScheduledAt: date })}
              onConfirm={() => confirmVisit.mutate(request.id)}
            />

            {/* Dossier */}
            <DossierLocatif
              request={request}
              canEdit={canEdit}
              isAdmin={isAdmin}
              rentalRequestId={request.id}
            />
          </div>

          {/* Right: actions */}
          <div className="space-y-4">
            {viewAs === 'tenant' && request.status === 'en_attente' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setCancelConfirm(true)}
                  disabled={cancel.isPending}
                >
                  Annuler ma candidature
                </Button>
              </div>
            )}

            {viewAs === 'owner' && request.status === 'en_attente' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Décision</h3>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setDecideModal('accept')}
                >
                  Accepter la candidature
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setDecideModal('refuse')}
                >
                  Refuser la candidature
                </Button>
              </div>
            )}

            {/* Tenant info for owner */}
            {viewAs === 'owner' && request.tenant && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Candidat</h3>
                <p className="font-medium text-gray-900">{request.tenant.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decide modal */}
      {decideModal && (
        <DecideRequestModal
          isOpen={!!decideModal}
          onClose={() => setDecideModal(null)}
          request={request}
          action={decideModal}
          onConfirm={handleDecideConfirm}
          isLoading={decide.isPending}
        />
      )}

      {/* Cancel confirm modal */}
      <Modal isOpen={cancelConfirm} onClose={() => setCancelConfirm(false)} title="Annuler la candidature">
        <p className="text-sm text-gray-600 mb-6">
          Êtes-vous sûr de vouloir annuler votre candidature pour <strong>{property.title}</strong> ?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCancelConfirm(false)}>Non</Button>
          <Button
            variant="danger"
            onClick={() => {
              cancel.mutate(request.id, {
                onSuccess: () => {
                  setCancelConfirm(false);
                  navigate(ROUTES.MES_CANDIDATURES);
                },
              });
            }}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? 'Annulation...' : 'Oui, annuler'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RequestDetailPage;
