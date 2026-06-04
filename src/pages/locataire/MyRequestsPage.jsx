import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useRentalRequests, useRentalRequestMutations } from '@/hooks/useRentalRequests';
import RentalRequestCard from '@/components/rental/RentalRequestCard';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const TABS = [
  { key: '',           label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'acceptee',   label: 'Acceptées' },
  { key: 'refusee',    label: 'Refusées' },
  { key: 'annulee',    label: 'Annulées' },
];

const EMPTY_MESSAGES = {
  '':           { text: 'Aucune candidature.', cta: true },
  en_attente:   { text: 'Aucune candidature en attente.', cta: false },
  acceptee:     { text: '✨ Aucune candidature acceptée pour l\'instant. Continuez à postuler !', cta: false },
  refusee:      { text: '👍 Aucun refus à déplorer. Bonne chance dans vos recherches !', cta: false },
  annulee:      { text: 'Aucune candidature annulée.', cta: false },
};

const MyRequestsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');

  const params = activeTab ? { status: activeTab } : {};
  const { data, isLoading } = useRentalRequests(params);
  const { cancel } = useRentalRequestMutations();

  const requests = data?.data ?? [];
  const empty = EMPTY_MESSAGES[activeTab] ?? EMPTY_MESSAGES[''];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
            <p className="text-sm text-gray-500">Suivez l'avancement de vos demandes de location</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{empty.text}</p>
            {empty.cta && (
              <Link
                to={ROUTES.ANNONCES}
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                Parcourir les annonces →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <RentalRequestCard
                key={req.id}
                request={req}
                viewAs="tenant"
                onClick={(id) => navigate(`/candidatures/${id}`)}
                onCancel={(id) => cancel.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
