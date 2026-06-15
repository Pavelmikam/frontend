import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import NotificationPreferenceToggle from '@/components/notifications/NotificationPreferenceToggle';

const schema = z.object({
  category:   z.enum(['property_type', 'amenity', 'charge']),
  value:      z.string().min(1).max(100),
  label:      z.string().min(1).max(150),
  is_active:  z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

const CATEGORY_OPTIONS = [
  { value: 'property_type', label: 'Type de bien' },
  { value: 'amenity',       label: 'Équipement' },
  { value: 'charge',        label: 'Charge' },
];

const CategoryForm = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const isEdit = !!initialData;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category:   initialData?.category ?? 'amenity',
      value:      initialData?.value    ?? '',
      label:      initialData?.label    ?? '',
      is_active:  initialData?.is_active ?? true,
      sort_order: initialData?.sort_order ?? 0,
    },
  });

  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <select
          {...register('category')}
          disabled={isEdit}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-0.5">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (slug)</label>
        <input
          {...register('value')}
          disabled={isEdit}
          placeholder="ex: internet_wifi"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        />
        {errors.value && <p className="text-xs text-red-500 mt-0.5">{errors.value.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label (affiché)</label>
        <input
          {...register('label')}
          placeholder="ex: Internet / WiFi"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.label && <p className="text-xs text-red-500 mt-0.5">{errors.label.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
        <input
          type="number"
          {...register('sort_order', { valueAsNumber: true })}
          min="0"
          max="9999"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.sort_order && <p className="text-xs text-red-500 mt-0.5">{errors.sort_order.message}</p>}
      </div>

      <NotificationPreferenceToggle
        label="Actif"
        value={isActive}
        onChange={(v) => setValue('is_active', v)}
        description="Désactiver pour masquer aux utilisateurs sans supprimer."
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
