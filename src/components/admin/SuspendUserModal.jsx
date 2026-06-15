import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const SuspendUserModal = ({ isOpen, onClose, user, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError('Le motif doit contenir au moins 10 caractères.');
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Suspendre l'utilisateur">
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              Suspendre <strong>{user?.name}</strong>
            </p>
            <p className="text-xs text-orange-700 mt-1">
              L'utilisateur sera bloqué et ne pourra plus se connecter.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motif de suspension <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            placeholder="Décrivez la raison de la suspension (minimum 10 caractères)..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-0.5">{reason.length} caractère(s)</p>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Annuler</Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading || reason.trim().length < 10}
          >
            {isLoading ? 'Suspension...' : 'Suspendre'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendUserModal;
