import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSavedSearchMutations } from '@/hooks/useSavedSearches';
import { PROPERTY_TYPES } from '@/utils/constants';

const schema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères').max(100, 'Maximum 100 caractères'),
  notifications_enabled: z.boolean(),
});

const buildCriteriaSummary = (filters) => {
  const keys = Object.keys(filters || {}).filter(
    (k) => !['page', 'sort', 'per_page'].includes(k) && filters[k]
  );
  if (!keys.length) return null;
  const parts = [];
  if (filters.type) {
    const t = PROPERTY_TYPES.find((x) => x.value === filters.type);
    parts.push(t?.label || filters.type);
  }
  if (filters.city) parts.push(filters.city);
  if (filters.price_max) parts.push(`max ${Number(filters.price_max).toLocaleString('fr-FR')} F`);
  if (filters.rooms_min) parts.push(`≥ ${filters.rooms_min} pièce(s)`);
  return parts.length ? parts.join(' · ') : `${keys.length} filtre(s)`;
};

const SaveSearchModal = ({ isOpen, onClose, currentFilters }) => {
  const { create } = useSavedSearchMutations();
  const summary = buildCriteriaSummary(currentFilters);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', notifications_enabled: true },
  });

  useEffect(() => {
    if (isOpen) reset({ name: '', notifications_enabled: true });
  }, [isOpen, reset]);

  const onSubmit = (values) => {
    create.mutate(
      {
        name: values.name,
        criteria: currentFilters,
        notifications_enabled: values.notifications_enabled,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sauvegarder cette recherche">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom de la recherche"
          placeholder="Ex: Studio Yaoundé pas cher"
          error={errors.name?.message}
          {...register('name')}
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            {...register('notifications_enabled')}
          />
          <span className="text-sm text-gray-700">Recevoir des alertes par email</span>
        </label>

        {/* Résumé */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Critères à sauvegarder</p>
          {summary ? (
            <p className="text-sm text-gray-700">{summary}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucun filtre actif</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
          <Button variant="primary" type="submit" disabled={create.isPending}>
            {create.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SaveSearchModal;
