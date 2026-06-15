import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MessageSquare } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useConversationMutations } from '@/hooks/useConversations';
import { formatPrice } from '@/utils/formatters';

const StartConversationModal = ({ isOpen, onClose, property, rentalRequestId }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const { start } = useConversationMutations();

  const handleSubmit = async () => {
    setApiError('');
    if (!message.trim() || message.trim().length < 5) {
      setApiError('Votre message doit contenir au moins 5 caractères.');
      return;
    }
    try {
      const result = await start.mutateAsync({
        propertyId: property.id,
        data: {
          initial_message: message.trim(),
          ...(rentalRequestId ? { rental_request_id: rentalRequestId } : {}),
        },
      });
      const convId = result?.data?.id ?? result?.id;
      onClose();
      setMessage('');
      if (convId) navigate(`/messagerie/${convId}`);
    } catch (err) {
      setApiError(err.userMessage || 'Erreur lors du démarrage de la conversation.');
    }
  };

  const handleClose = () => {
    setMessage('');
    setApiError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contacter le propriétaire" size="md">
      <div className="space-y-4">
        {/* Property summary */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {property?.primary_image ? (
              <img src={property.primary_image} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Building2 className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{property?.title}</p>
            <p className="text-sm text-gray-500">
              {property?.city}{property?.price ? ` · ${formatPrice(property.price)}` : ''}
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            maxLength={2000}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setApiError(''); }}
            placeholder="Bonjour, je suis intéressé par ce logement..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">{message.length}/2000</p>
        </div>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Un seul fil de discussion par bien. Si une conversation existe déjà, vous y serez redirigé.
          </p>
        </div>

        {apiError && <Alert type="error" message={apiError} onDismiss={() => setApiError('')} />}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={start.isPending}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={start.isPending || message.trim().length < 5}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {start.isPending ? 'Envoi...' : 'Envoyer le message'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StartConversationModal;
