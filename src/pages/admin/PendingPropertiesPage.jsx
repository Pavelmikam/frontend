import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, XCircle, Eye, Building2, Search,
  Clock, Globe, Archive, FileX, FileText, RefreshCw,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminProperties } from '@/api/property.api';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { formatPrice, formatSurface, formatRelativeDate, getStatusInfo } from '@/utils/formatters';
import { ROUTES, PROPERTY_STATUSES } from '@/utils/constants';

/* ── Status tabs config ───────────────────────────────────────────────────── */
const TABS = [
  { value: '',         label: 'Toutes',       Icon: FileText },
  { value: 'pending',  label: 'En attente',   Icon: Clock    },
  { value: 'active',   label: 'Publiées',     Icon: Globe    },
  { value: 'rejected', label: 'Rejetées',     Icon: FileX    },
  { value: 'archived', label: 'Archivées',    Icon: Archive  },
  { value: 'draft',    label: 'Brouillons',   Icon: FileText },
];

/* ── Status badge ─────────────────────────────────────────────────────────── */
const COLOR_MAP = {
  green:  'bg-green-100 text-green-700 ring-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
  red:    'bg-red-100 text-red-700 ring-red-200',
  gray:   'bg-gray-100 text-gray-600 ring-gray-200',
};

const StatusPill = ({ status }) => {
  const { label, color } = getStatusInfo(status);
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${COLOR_MAP[color] ?? COLOR_MAP.gray}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

/* ── Main component ───────────────────────────────────────────────────────── */
const PendingPropertiesPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab]         = useState('pending');
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError]                 = useState('');

  const { moderateProperty } = usePropertyMutations();

  /* debounce search */
  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  }, []);

  const params = {
    page,
    per_page: 15,
    ...(activeTab && { status: activeTab }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['adminProperties', params],
    queryFn: () => getAdminProperties(params),
    keepPreviousData: true,
  });

  const properties = data?.data ?? [];
  const meta       = data?.meta ?? {};
  const lastPage   = meta.last_page ?? 1;
  const total      = meta.total ?? 0;

  /* ── Counts per tab (from current data only — server gives filtered totals) */
  const tabCounts = TABS.reduce((acc, t) => {
    acc[t.value] = t.value === activeTab ? total : '—';
    return acc;
  }, {});

  /* ── Actions ──────────────────────────────────────────────────────────────*/
  const handleApprove = async () => {
    setError('');
    try {
      await moderateProperty.mutateAsync({ id: approveTarget.id, data: { action: 'approve' } });
      setApproveTarget(null);
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    } catch (e) {
      setError(e.userMessage || "Erreur lors de l'approbation.");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setError('');
    try {
      await moderateProperty.mutateAsync({
        id: rejectTarget.id,
        data: { action: 'reject', rejection_reason: rejectionReason.trim() },
      });
      setRejectTarget(null);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
    } catch (e) {
      setError(e.userMessage || 'Erreur lors du rejet.');
    }
  };

  const switchTab = (val) => {
    setActiveTab(val);
    setPage(1);
  };

  /* ── Render ───────────────────────────────────────────────────────────────*/
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modération des annonces</h1>
            <p className="text-sm text-gray-500 mt-1">
              Validez ou rejetez les annonces soumises par les propriétaires
            </p>
          </div>
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminProperties'] })}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <Globe className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Seules les annonces <strong>approuvées</strong> sont visibles publiquement sur la page d'accueil et la liste des annonces. Les annonces rejetées ou en brouillon restent invisibles aux visiteurs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 scrollbar-none">
          {TABS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => switchTab(value)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                activeTab === value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {activeTab === value && total > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  activeTab === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, ville..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(search || activeTab !== 'pending') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setDebouncedSearch(''); switchTab('pending'); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} className="mb-4" />}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
            {activeTab === 'pending' ? (
              <>
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
                <p className="font-medium text-gray-800">Aucune annonce en attente</p>
                <p className="text-sm mt-1">Toutes les annonces ont été traitées.</p>
              </>
            ) : (
              <>
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-800">Aucune annonce trouvée</p>
                <p className="text-sm mt-1">Essayez un autre filtre ou une autre recherche.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <PropertyRow
                key={property.id}
                property={property}
                onApprove={() => setApproveTarget(property)}
                onReject={() => { setRejectTarget(property); setRejectionReason(''); }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Précédent
            </Button>
            <span className="text-sm text-gray-600">Page {page} sur {lastPage}</span>
            <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
              Suivant
            </Button>
          </div>
        )}
      </div>

      {/* ── Approve modal ── */}
      <Modal isOpen={!!approveTarget} onClose={() => setApproveTarget(null)} title="Approuver l'annonce">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Vous êtes sur le point d'approuver :
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="font-semibold text-gray-900">{approveTarget?.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {approveTarget?.city} · {formatPrice(approveTarget?.price)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            <Globe className="inline h-4 w-4 text-green-600 mr-1" />
            Cette annonce sera <strong className="text-green-700">immédiatement visible</strong> sur la page d'accueil et la liste publique.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setApproveTarget(null)}>Annuler</Button>
          <Button
            onClick={handleApprove}
            disabled={moderateProperty.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {moderateProperty.isPending ? 'Approbation...' : '✓ Approuver et publier'}
          </Button>
        </div>
      </Modal>

      {/* ── Reject modal ── */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectionReason(''); }}
        title="Rejeter l'annonce"
      >
        <div className="mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <p className="font-semibold text-gray-900">{rejectTarget?.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {rejectTarget?.city} · {formatPrice(rejectTarget?.price)}
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motif du rejet <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            rows={4}
            placeholder="Expliquez la raison du rejet au propriétaire (min. 10 caractères)..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">{rejectionReason.length} caractère(s)</p>
          {rejectionReason.length > 0 && rejectionReason.length < 10 && (
            <p className="text-xs text-red-500 mt-1">Le motif doit contenir au moins 10 caractères.</p>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Le propriétaire recevra une notification avec ce motif et pourra corriger son annonce.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionReason(''); }}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={moderateProperty.isPending || rejectionReason.trim().length < 10}
          >
            {moderateProperty.isPending ? 'Rejet...' : '✗ Rejeter'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

/* ── Property row card ────────────────────────────────────────────────────── */
const PropertyRow = ({ property, onApprove, onReject }) => {
  const isPending  = property.status === 'pending';
  const isActive   = property.status === 'active';
  const isRejected = property.status === 'rejected';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 hover:border-gray-300 transition-colors">

      {/* Thumbnail */}
      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {property.thumbnail_url ? (
          <img
            src={property.thumbnail_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Building2 className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <StatusPill status={property.status} />
          {isActive && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
              <Globe className="h-3 w-3" /> Visible publiquement
            </span>
          )}
          {isRejected && property.rejection_reason && (
            <span className="text-xs text-red-500 italic truncate max-w-xs" title={property.rejection_reason}>
              Motif : {property.rejection_reason}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 truncate text-sm">{property.title}</h3>

        <p className="text-sm text-gray-500 mt-0.5">
          {property.city}{property.district ? ` · ${property.district}` : ''}{' '}
          {property.price ? `· ${formatPrice(property.price)}` : ''}{' '}
          {property.surface ? `· ${formatSurface(property.surface)}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-400">
          {property.owner && (
            <span>
              Par <span className="text-gray-600 font-medium">{property.owner.name}</span>
              {property.owner.email && (
                <span className="ml-1 text-gray-400">({property.owner.email})</span>
              )}
            </span>
          )}
          {property.published_at ? (
            <span>Publié {formatRelativeDate(property.published_at)}</span>
          ) : (
            <span>Soumis {formatRelativeDate(property.created_at)}</span>
          )}
          {property.views_count > 0 && (
            <span>{property.views_count} vue(s)</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 flex-shrink-0 items-start sm:items-end">
        <Link to={`${ROUTES.ANNONCES}/${property.id}`} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Voir</span>
          </Button>
        </Link>

        {isPending && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={onApprove}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Approuver</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Rejeter</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingPropertiesPage;
