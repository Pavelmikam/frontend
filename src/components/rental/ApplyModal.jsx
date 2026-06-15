import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Send } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useRentalRequestMutations } from '@/hooks/useRentalRequests';
import { formatPrice } from '@/utils/formatters';

const ApplyModal = ({ isOpen, onClose, property }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const { create } = useRentalRequestMutations();

  const handleSubmit = async () => {
    setApiError('');
    const trimmed = message.trim();
    if (trimmed && trimmed.length < 10) {
      setApiError('Votre message doit contenir au moins 10 caractères.');
      return;
    }
    try {
      const result = await create.mutateAsync({
        propertyId: property.id,
        data: { message: trimmed || undefined },
      });
      const newId = result?.data?.id ?? result?.id;
      onClose();
      setMessage('');
      if (newId) navigate(`/candidatures/${newId}`);
    } catch (err) {
      setApiError(err.userMessage || 'Erreur lors de l\'envoi de la candidature.');
    }
  };

  const handleClose = () => {
    setMessage('');
    setApiError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Postuler sur ce bien" size="md">
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
            Message de candidature <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            rows={5}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Présentez-vous et expliquez pourquoi ce logement vous convient..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">{message.length}/1000</p>
        </div>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <p className="text-xs text-blue-700">
            Après votre candidature, vous pourrez uploader vos documents de dossier locatif pour renforcer votre dossier.
          </p>
        </div>

        {apiError && <Alert type="error" message={apiError} onDismiss={() => setApiError('')} />}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={create.isPending}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={create.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {create.isPending ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyModal;
