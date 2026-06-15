import { useState } from 'react';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { useExports } from '@/hooks/useExports';
import PeriodSelector from '@/components/stats/PeriodSelector';
import ExportButton from '@/components/stats/ExportButton';
import Select from '@/components/ui/Select';
import { RENTAL_REQUEST_STATUSES, ROLES } from '@/utils/constants';

const FORMAT_OPTIONS = [
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'csv',  label: 'CSV (.csv)'   },
];

const ROLE_OPTIONS = [
  { value: '',                 label: 'Tous les rôles' },
  { value: ROLES.LOCATAIRE,    label: 'Locataires'     },
  { value: ROLES.PROPRIETAIRE, label: 'Propriétaires'  },
];

const STATUS_OPTIONS = [
  { value: '',          label: 'Tous les statuts' },
  ...RENTAL_REQUEST_STATUSES.map((s) => ({ value: s.value, label: s.label })),
];

const ACTIVE_OPTIONS = [
  { value: '',     label: 'Tous'       },
  { value: 'true', label: 'Actifs'     },
  { value: 'false', label: 'Suspendus' },
];

const SectionCard = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const AdminExportPage = () => {
  const { loading, exportProperties, exportUsers, exportRentalRequests, exportActivityReport } = useExports();

  // Annonces
  const [propFormat, setPropFormat] = useState('xlsx');
  const [propCity, setPropCity] = useState('');

  // Utilisateurs
  const [userRole, setUserRole]     = useState('');
  const [userActive, setUserActive] = useState('');
  const [userFormat, setUserFormat] = useState('xlsx');

  // Demandes
  const [reqStatus, setReqStatus]   = useState('');
  const [reqPropId, setReqPropId]   = useState('');
  const [reqFormat, setReqFormat]   = useState('xlsx');

  // Rapport activité
  const [actPeriod, setActPeriod]   = useState('30days');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exports de données</h1>
        <p className="text-gray-500 mt-1">Téléchargez les données de la plateforme</p>
      </div>

      {/* Annonces */}
      <SectionCard
        title="Annonces immobilières"
        description="Colonnes : ID, titre, type, ville, prix, vues, favoris, demandes, propriétaire"
        icon={FileSpreadsheet}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ville (optionnel)</label>
            <input
              type="text"
              value={propCity}
              onChange={(e) => setPropCity(e.target.value)}
              placeholder="Ex : Yaoundé"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
            <Select options={FORMAT_OPTIONS} value={propFormat} onChange={(e) => setPropFormat(e.target.value)} />
          </div>
        </div>
        <ExportButton
          label="Exporter les annonces"
          onExport={() => exportProperties(propCity ? { city: propCity } : {}, propFormat)}
          isLoading={loading.properties}
          format={propFormat}
        />
      </SectionCard>

      {/* Utilisateurs */}
      <SectionCard
        title="Utilisateurs"
        description="Colonnes : ID, nom, email, rôle, points contribution, date inscription"
        icon={FileSpreadsheet}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Rôle</label>
            <Select options={ROLE_OPTIONS} value={userRole} onChange={(e) => setUserRole(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <Select options={ACTIVE_OPTIONS} value={userActive} onChange={(e) => setUserActive(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
            <Select options={FORMAT_OPTIONS} value={userFormat} onChange={(e) => setUserFormat(e.target.value)} />
          </div>
        </div>
        <ExportButton
          label="Exporter les utilisateurs"
          onExport={() => exportUsers(userRole || null, userActive === '' ? null : userActive === 'true', userFormat)}
          isLoading={loading.users}
          format={userFormat}
        />
      </SectionCard>

      {/* Demandes de location */}
      <SectionCard
        title="Demandes de location"
        description="Colonnes : ID, locataire, annonce, statut, date, propriétaire"
        icon={FileSpreadsheet}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <Select options={STATUS_OPTIONS} value={reqStatus} onChange={(e) => setReqStatus(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ID Annonce (optionnel)</label>
            <input
              type="number"
              value={reqPropId}
              onChange={(e) => setReqPropId(e.target.value)}
              placeholder="Ex : 42"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
            <Select options={FORMAT_OPTIONS} value={reqFormat} onChange={(e) => setReqFormat(e.target.value)} />
          </div>
        </div>
        <ExportButton
          label="Exporter les demandes"
          onExport={() => exportRentalRequests(reqStatus || null, reqPropId ? parseInt(reqPropId) : null, reqFormat)}
          isLoading={loading.rentalRequests}
          format={reqFormat}
        />
      </SectionCard>

      {/* Rapport d'activité PDF */}
      <SectionCard
        title="Rapport d'activité (PDF)"
        description="Top villes, types de biens, taux d'acceptation, graphiques d'évolution"
        icon={FileText}
      >
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Période</label>
          <PeriodSelector value={actPeriod} onChange={setActPeriod} />
        </div>
        <ExportButton
          label="Générer le rapport PDF"
          onExport={() => exportActivityReport(actPeriod)}
          isLoading={loading.activityReport}
          format="pdf"
          icon={<FileText className="h-4 w-4" />}
        />
      </SectionCard>
    </div>
  );
};

export default AdminExportPage;
