import { useState } from 'react';
import { Bell, BellOff, Play, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatRelativeDate } from '@/utils/formatters';
import { PROPERTY_TYPES } from '@/utils/constants';

const buildCriteriaSummary = (criteria) => {
  if (!criteria) return 'Aucun critère';
  const parts = [];
  if (criteria.type) {
    const t = PROPERTY_TYPES.find((x) => x.value === criteria.type);
    parts.push(t ? t.label : criteria.type);
  }
  if (criteria.city) parts.push(criteria.city);
  if (criteria.neighborhood) parts.push(criteria.neighborhood);
  if (criteria.price_max) parts.push(`max ${Number(criteria.price_max).toLocaleString('fr-FR')} F`);
  if (criteria.price_min) parts.push(`min ${Number(criteria.price_min).toLocaleString('fr-FR')} F`);
  if (criteria.rooms_min) parts.push(`≥ ${criteria.rooms_min} pièce(s)`);
  if (criteria.surface_min || criteria.surface_max) {
    const s = [criteria.surface_min, criteria.surface_max].filter(Boolean).join('—');
    parts.push(`${s} m²`);
  }
  return parts.length ? parts.join(' · ') : 'Tous les biens';
};

const SavedSearchCard = ({ savedSearch, onDelete, onToggleNotifications, onRunSearch }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{savedSearch.name}</p>
          <p className="text-sm text-gray-500 mt-0.5 truncate">
            {buildCriteriaSummary(savedSearch.criteria)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Créée {formatRelativeDate(savedSearch.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggleNotifications(savedSearch.id)}
            title={savedSearch.notifications_enabled ? 'Désactiver les alertes' : 'Activer les alertes'}
            className={`p-2 rounded-lg transition-colors ${
              savedSearch.notifications_enabled
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {savedSearch.notifications_enabled
              ? <Bell className="h-4 w-4" />
              : <BellOff className="h-4 w-4" />
            }
          </button>
          <button
            type="button"
            onClick={() => onRunSearch(savedSearch.criteria)}
            title="Relancer la recherche"
            className="p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            title="Supprimer"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Supprimer la recherche"
      >
        <p className="text-sm text-gray-600 mb-6">
          Supprimer <strong>{savedSearch.name}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDelete(false)}>Annuler</Button>
          <Button
            variant="danger"
            onClick={() => { onDelete(savedSearch.id); setConfirmDelete(false); }}
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SavedSearchCard;
