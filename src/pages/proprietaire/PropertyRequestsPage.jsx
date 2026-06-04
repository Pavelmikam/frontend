import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle } from 'lucide-react';
import { useRentalRequests, useRentalRequestMutations } from '@/hooks/useRentalRequests';
import useProperty from '@/hooks/useProperty';
import RentalRequestCard from '@/components/rental/RentalRequestCard';
import DecideRequestModal from '@/components/rental/DecideRequestModal';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const TABS = [
  { key: '',           label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'acceptee',   label: 'Acceptées' },
  { key: 'refusee',    label: 'Refusées' },
];

const PropertyRequestsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [decideTarget, setDecideTarget] = useState(null);

  const { data: propertyData } = useProperty(id);
  const property = propertyData?.data ?? propertyData;

  const params = activeTab ? { status: activeTab, property_id: id } : { property_id: id };
  const { data, isLoading } = useRentalRequests(params);
  const { decide } = useRentalRequestMutations();

  const requests = data?.data ?? [];
  const total = data?.meta?.total ?? requests.length;
  const pending = requests.filter((r) => r.status === 'en_attente').length;
  const accepted = requests.filter((r) => r.status === 'acceptee').length;

  const handleDecideConfirm = (action, ownerResponse) => {
    if (!decideTarget) return;
    decide.mutate(
      { id: decideTarget.id, data: { action, owner_response: ownerResponse } },
      { onSuccess: () => setDecideTarget(null) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to={ROUTES.MES_ANNONCES}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes annonces
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Candidatures{property?.title ? ` — ${property.title}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les demandes de location reçues</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: total, icon: Users, color: 'blue' },
            { label: 'En attente', value: pending, icon: Clock, color: 'yellow' },
            { label: 'Acceptées', value: accepted, icon: CheckCircle, color: 'green' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-1 text-${color}-500`} />
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
            </div>
          ))}
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
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune candidature{activeTab ? ' dans cet onglet' : ''}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <RentalRequestCard
                key={req.id}
                request={req}
                viewAs="owner"
                onClick={(id) => navigate(`/candidatures/${id}`)}
                onDecide={(reqId, action) => {
                  const target = requests.find((r) => r.id === reqId);
                  setDecideTarget({ ...target, action });
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decide modal */}
      {decideTarget && (
        <DecideRequestModal
          isOpen={!!decideTarget}
          onClose={() => setDecideTarget(null)}
          request={decideTarget}
          action={decideTarget.action}
          onConfirm={handleDecideConfirm}
          isLoading={decide.isPending}
        />
      )}
    </div>
  );
};

export default PropertyRequestsPage;
