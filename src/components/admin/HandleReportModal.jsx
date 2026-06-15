import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { REPORT_REASONS, REPORT_HANDLE_ACTIONS } from '@/utils/constants';

const HandleReportModal = ({ isOpen, onClose, report, onConfirm, isLoading }) => {
  const [action, setAction] = useState('resolve');
  const [adminNote, setAdminNote] = useState('');
  const [error, setError] = useState('');

  const reasonLabel = REPORT_REASONS.find((r) => r.value === report?.reason)?.label ?? report?.reason;
  const isProperty = report?.reportable_type?.includes('Property');

  const handleConfirm = () => {
    if (!adminNote.trim() || adminNote.trim().length < 5) {
      setError('La note admin est obligatoire (minimum 5 caractères).');
      return;
    }
    onConfirm(action, adminNote.trim());
  };

  const handleClose = () => {
    setAction('resolve');
    setAdminNote('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Traiter le signalement" size="md">
      <div className="space-y-4">
        {/* Résumé */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm space-y-1">
          <p><span className="text-gray-500">Type :</span> <span className="font-medium">{isProperty ? 'Annonce' : 'Message'}</span></p>
          <p><span className="text-gray-500">Raison :</span> <span className="font-medium">{reasonLabel}</span></p>
          {report?.reporter?.name && (
            <p><span className="text-gray-500">Signalé par :</span> <span className="font-medium">{report.reporter.name}</span></p>
          )}
          {report?.description && (
            <p><span className="text-gray-500">Description :</span> <span className="text-gray-700 italic">"{report.description}"</span></p>
          )}
        </div>

        {/* Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {REPORT_HANDLE_ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Note admin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note admin <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={adminNote}
            onChange={(e) => { setAdminNote(e.target.value); setError(''); }}
            placeholder="Décrivez votre décision (minimum 5 caractères)..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Annuler</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || adminNote.trim().length < 5}
          >
            {isLoading ? 'Traitement...' : 'Valider'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HandleReportModal;
