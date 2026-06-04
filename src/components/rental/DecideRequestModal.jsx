import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const DecideRequestModal = ({ isOpen, onClose, request, action, onConfirm, isLoading }) => {
  const [ownerResponse, setOwnerResponse] = useState('');
  const [error, setError] = useState('');

  const isAccept = action === 'accept';
  const isRefuse = action === 'refuse';

  const handleConfirm = () => {
    setError('');
    if (isRefuse && ownerResponse.trim().length < 10) {
      setError('Le motif du refus doit contenir au moins 10 caractères.');
      return;
    }
    onConfirm(action, ownerResponse.trim() || undefined);
  };

  const handleClose = () => {
    setOwnerResponse('');
    setError('');
    onClose();
  };

  const title = isAccept ? 'Accepter la candidature' : 'Refuser la candidature';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4">
        {isAccept && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Attention :</strong> Cette action refusera automatiquement toutes les autres
              candidatures en attente sur ce bien.
            </p>
          </div>
        )}

        {isAccept && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message de bienvenue <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Un mot de bienvenue pour le locataire..."
              value={ownerResponse}
              onChange={(e) => setOwnerResponse(e.target.value)}
            />
          </div>
        )}

        {isRefuse && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motif du refus <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Expliquez pourquoi vous refusez cette candidature (min. 10 caractères)..."
              value={ownerResponse}
              onChange={(e) => { setOwnerResponse(e.target.value); setError(''); }}
            />
            <p className="text-xs text-gray-400 mt-1">{ownerResponse.length} caractère(s)</p>
          </div>
        )}

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          {isAccept && (
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isLoading ? 'Traitement...' : "Confirmer l'acceptation"}
            </Button>
          )}
          {isRefuse && (
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={isLoading || ownerResponse.trim().length < 10}
            >
              {isLoading ? 'Traitement...' : 'Confirmer le refus'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DecideRequestModal;
