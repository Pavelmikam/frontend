import { Bell, Info } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import NotificationPreferenceToggle from '@/components/notifications/NotificationPreferenceToggle';
import Spinner from '@/components/ui/Spinner';
import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_LABELS } from '@/utils/constants';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
    <div className="divide-y divide-gray-100">{children}</div>
  </div>
);

const NotificationPreferencesPage = () => {
  const { isLocataire, isProprietaire } = useAuth();
  const { preferences, isLoading, update } = useNotificationPreferences();

  const getEnabled = (type) => preferences?.enabled_types?.[type] ?? true;
  const mailEnabled = preferences?.channels?.mail ?? true;

  const handleChannelChange = (channel, value) => {
    update.mutate({ channels: { [channel]: value } });
  };

  const handleTypeChange = (type, value) => {
    update.mutate({ enabled_types: { [type]: value } });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Préférences de notifications
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Gérez comment et quand vous recevez des notifications.
        </p>
      </div>

      {/* Canaux */}
      <Section title="Canaux de diffusion">
        <NotificationPreferenceToggle
          label="Notifications dans l'application"
          value={true}
          disabled={true}
          description="Toujours actif — affiché dans le centre de notifications."
        />
        <NotificationPreferenceToggle
          label="Notifications par email"
          value={mailEnabled}
          onChange={(v) => handleChannelChange('mail', v)}
          description="Recevoir un email en plus de la notification in-app."
        />
      </Section>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Les notifications dans l'application sont toujours envoyées, même si un type est désactivé.
        </p>
      </div>

      {/* Demandes de location */}
      <Section title="Demandes de location">
        {isProprietaire && (
          <NotificationPreferenceToggle
            label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.RENTAL_REQUEST_RECEIVED]}
            value={getEnabled(NOTIFICATION_TYPES.RENTAL_REQUEST_RECEIVED)}
            onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.RENTAL_REQUEST_RECEIVED, v)}
            description="Quand un locataire postule sur l'un de vos biens."
          />
        )}
        {isLocataire && (
          <>
            <NotificationPreferenceToggle
              label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.RENTAL_REQUEST_ACCEPTED]}
              value={getEnabled(NOTIFICATION_TYPES.RENTAL_REQUEST_ACCEPTED)}
              onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.RENTAL_REQUEST_ACCEPTED, v)}
              description="Quand un propriétaire accepte votre candidature."
            />
            <NotificationPreferenceToggle
              label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.RENTAL_REQUEST_REFUSED]}
              value={getEnabled(NOTIFICATION_TYPES.RENTAL_REQUEST_REFUSED)}
              onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.RENTAL_REQUEST_REFUSED, v)}
              description="Quand un propriétaire refuse votre candidature."
            />
            <NotificationPreferenceToggle
              label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.VISIT_SCHEDULED]}
              value={getEnabled(NOTIFICATION_TYPES.VISIT_SCHEDULED)}
              onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.VISIT_SCHEDULED, v)}
              description="Quand une visite est planifiée pour votre candidature."
            />
          </>
        )}
      </Section>

      {/* Messagerie */}
      <Section title="Messagerie">
        <NotificationPreferenceToggle
          label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.MESSAGE_RECEIVED]}
          value={getEnabled(NOTIFICATION_TYPES.MESSAGE_RECEIVED)}
          onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.MESSAGE_RECEIVED, v)}
          description="Quand vous recevez un nouveau message."
        />
      </Section>

      {/* Annonces */}
      {isProprietaire && (
        <Section title="Annonces">
          <NotificationPreferenceToggle
            label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.PROPERTY_APPROVED]}
            value={getEnabled(NOTIFICATION_TYPES.PROPERTY_APPROVED)}
            onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.PROPERTY_APPROVED, v)}
            description="Quand l'une de vos annonces est approuvée par un administrateur."
          />
          <NotificationPreferenceToggle
            label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.PROPERTY_REJECTED]}
            value={getEnabled(NOTIFICATION_TYPES.PROPERTY_REJECTED)}
            onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.PROPERTY_REJECTED, v)}
            description="Quand l'une de vos annonces est rejetée par un administrateur."
          />
        </Section>
      )}

      {/* Recherches sauvegardées */}
      <Section title="Recherches sauvegardées">
        <NotificationPreferenceToggle
          label={NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPES.SAVED_SEARCH_MATCH]}
          value={getEnabled(NOTIFICATION_TYPES.SAVED_SEARCH_MATCH)}
          onChange={(v) => handleTypeChange(NOTIFICATION_TYPES.SAVED_SEARCH_MATCH, v)}
          description="Quand un nouveau bien correspond à l'une de vos recherches sauvegardées."
        />
      </Section>
    </div>
  );
};

export default NotificationPreferencesPage;
