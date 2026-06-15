import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RentalStatusBadge from '@/components/ui/RentalStatusBadge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { formatPrice } from '@/utils/formatters';

const RentalRequestCard = ({ request, viewAs = 'tenant', onDecide, onCancel, onClick }) => {
  const navigate = useNavigate();
  const property = request.property ?? {};
  const tenant = request.tenant ?? {};

  const formattedDate = request.created_at
    ? format(new Date(request.created_at), 'd MMM yyyy', { locale: fr })
    : '';

  const shortMessage = request.message
    ? request.message.length > 100
      ? request.message.slice(0, 100) + '…'
      : request.message
    : null;

  const handleMessage = (e) => {
    e.stopPropagation();
    if (request.conversation_id) {
      navigate(`/messagerie/${request.conversation_id}`);
    } else if (property.id) {
      navigate(`/messagerie?start=${property.id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 hover:border-blue-300 transition-colors cursor-pointer"
      onClick={() => onClick?.(request.id)}
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {property.primary_image ? (
          <img
            src={property.primary_image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Building2 className="h-7 w-7" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <RentalStatusBadge status={request.status} />
          {request.dossier_complete ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
              <CheckCircle className="h-3 w-3" /> Dossier complet
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
              <Clock className="h-3 w-3" /> Dossier incomplet
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
        <p className="text-sm text-gray-500">
          {property.city}{property.city && property.price ? ' · ' : ''}
          {property.price && formatPrice(property.price)}
        </p>

        {shortMessage && (
          <p className="text-xs text-gray-500 mt-1 italic">"{shortMessage}"</p>
        )}

        <p className="text-xs text-gray-400 mt-1">Candidature du {formattedDate}</p>

        {/* Owner view: tenant info */}
        {viewAs === 'owner' && tenant.name && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar src={tenant.avatar_thumb_url} name={tenant.name} size="xs" />
            <span className="text-sm text-gray-700 font-medium">{tenant.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex sm:flex-col gap-2 flex-shrink-0 self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
        {viewAs === 'tenant' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              onClick={() => onClick?.(request.id)}
            >
              Voir ma demande
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 whitespace-nowrap flex items-center gap-1"
              onClick={handleMessage}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Message
            </Button>
            {request.status === 'en_attente' && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => onCancel?.(request.id)}
              >
                Annuler
              </Button>
            )}
          </>
        )}

        {viewAs === 'owner' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 whitespace-nowrap flex items-center gap-1"
              onClick={handleMessage}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Message
            </Button>
            {request.status === 'en_attente' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => onDecide?.(request.id, 'accept')}
                >
                  Accepter
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => onDecide?.(request.id, 'refuse')}
                >
                  Refuser
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentalRequestCard;
