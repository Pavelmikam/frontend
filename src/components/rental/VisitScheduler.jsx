import { useState } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from '@/components/ui/Button';

const VisitScheduler = ({ request, viewAs, onSchedule, onConfirm }) => {
  const [dateValue, setDateValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive = ['en_attente', 'acceptee'].includes(request?.status);
  if (!isActive) return null;

  const hasVisit = !!request.visit_scheduled_at;
  const isConfirmed = request.visit_confirmed;

  const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const handleSchedule = async () => {
    if (!dateValue) return;
    setIsSubmitting(true);
    try {
      // datetime-local gives "YYYY-MM-DDTHH:MM" — add seconds for Laravel validation
      const formatted = dateValue.length === 16 ? dateValue + ':00' : dateValue;
      await onSchedule?.(formatted);
      setDateValue('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedVisitDate = hasVisit
    ? format(new Date(request.visit_scheduled_at), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-semibold text-gray-900">Visite</h3>
      </div>

      {!hasVisit && viewAs === 'owner' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Planifiez une date de visite pour ce candidat.</p>
          <div className="flex gap-3">
            <input
              type="datetime-local"
              lang="fr-FR"
              min={minDateTime}
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleSchedule}
              disabled={!dateValue || isSubmitting}
            >
              {isSubmitting ? 'Planification...' : 'Planifier'}
            </Button>
          </div>
        </div>
      )}

      {!hasVisit && viewAs === 'tenant' && (
        <p className="text-sm text-gray-500 italic">
          Le propriétaire n'a pas encore planifié de visite.
        </p>
      )}

      {hasVisit && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 capitalize">{formattedVisitDate}</p>
            </div>
          </div>

          {isConfirmed ? (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>Présence confirmée par le locataire</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Clock className="h-4 w-4" />
              <span>En attente de confirmation du locataire</span>
            </div>
          )}

          {viewAs === 'tenant' && !isConfirmed && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isSubmitting ? 'Confirmation...' : 'Confirmer ma présence'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitScheduler;
