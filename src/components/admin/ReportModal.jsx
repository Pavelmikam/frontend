import { useState } from 'react';
import { Flag } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useReportMutations } from '@/hooks/useAdminReports';
import { REPORT_REASONS } from '@/utils/constants';

const ReportModal = ({ isOpen, onClose, type, targetId }) => {
  const [reason, setReason] = useState('arnaque_suspectee');
  const [description, setDescription] = useState('');
  const [apiError, setApiError] = useState('');
  const { reportProperty, reportMessage } = useReportMutations();

  const isPending = type === 'property' ? reportProperty.isPending : reportMessage.isPending;

  const handleSubmit = async () => {
    setApiError('');
    try {
      const data = { reason, description: description.trim() || undefined };
      if (type === 'property') {
        await reportProperty.mutateAsync({ propertyId: targetId, data });
      } else {
        await reportMessage.mutateAsync({ messageId: targetId, data });
      }
      onClose();
      setReason('arnaque_suspectee');
      setDescription('');
    } catch (err) {
      setApiError(err.userMessage || 'Erreur lors du signalement.');
    }
  };

  const handleClose = () => {
    setReason('arnaque_suspectee');
    setDescription('');
    setApiError('');
    onClose();
  };

  const title = type === 'property' ? 'Signaler cette annonce' : 'Signaler ce message';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raison <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {REPORT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            rows={3}
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Donnez plus de détails sur le problème..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <Flag className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Votre signalement sera examiné par notre équipe dans les meilleurs délais.
          </p>
        </div>

        {apiError && <Alert type="error" message={apiError} onDismiss={() => setApiError('')} />}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>Annuler</Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <Flag className="h-4 w-4" />
            {isPending ? 'Envoi...' : 'Signaler'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
