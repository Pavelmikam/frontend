import { X } from 'lucide-react';
import { format } from 'date-fns';
import { PROPERTY_TYPES, AMENITIES } from '@/utils/constants';
import { formatPriceShort } from '@/utils/formatters';

const Badge = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:text-blue-900 transition-colors"
      aria-label={`Retirer ${label}`}
    >
      <X className="h-3 w-3" />
    </button>
  </span>
);

const SearchActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const badges = [];

  if (filters.city) {
    badges.push({ key: 'city', label: filters.city, remove: () => onRemoveFilter('city') });
  }

  if (filters.type) {
    const typeLabel = PROPERTY_TYPES.find((t) => t.value === filters.type)?.label || filters.type;
    badges.push({ key: 'type', label: typeLabel, remove: () => onRemoveFilter('type') });
  }

  if (filters.neighborhood) {
    badges.push({ key: 'neighborhood', label: `Quartier: ${filters.neighborhood}`, remove: () => onRemoveFilter('neighborhood') });
  }

  if (filters.price_min || filters.price_max) {
    const min = filters.price_min ? formatPriceShort(Number(filters.price_min)) : '0 F';
    const max = filters.price_max ? formatPriceShort(Number(filters.price_max)) : '∞';
    badges.push({
      key: 'price',
      label: `${min} — ${max}`,
      remove: () => { onRemoveFilter('price_min'); onRemoveFilter('price_max'); },
    });
  }

  if (filters.surface_min || filters.surface_max) {
    const min = filters.surface_min || '0';
    const max = filters.surface_max || '∞';
    badges.push({
      key: 'surface',
      label: `${min} — ${max} m²`,
      remove: () => { onRemoveFilter('surface_min'); onRemoveFilter('surface_max'); },
    });
  }

  if (filters.rooms_min) {
    badges.push({ key: 'rooms_min', label: `≥ ${filters.rooms_min} pièce${Number(filters.rooms_min) > 1 ? 's' : ''}`, remove: () => onRemoveFilter('rooms_min') });
  }

  const amenities = filters.amenities || filters['amenities[]'] || [];
  const amenitiesArr = Array.isArray(amenities) ? amenities : [amenities];
  amenitiesArr.forEach((val) => {
    const found = AMENITIES.find((a) => a.value === val);
    if (found) {
      badges.push({
        key: `amenity-${val}`,
        label: `${found.icon} ${found.label}`,
        remove: () => {
          const newArr = amenitiesArr.filter((v) => v !== val);
          onRemoveFilter('amenities', newArr);
        },
      });
    }
  });

  if (filters.available_from) {
    const d = format(new Date(filters.available_from), 'dd/MM/yyyy');
    badges.push({ key: 'available_from', label: `Dispo. le ${d}`, remove: () => onRemoveFilter('available_from') });
  }

  if (filters.latitude && filters.longitude) {
    const label = `Autour de ma position${filters.radius_km ? ` (${filters.radius_km} km)` : ''}`;
    badges.push({
      key: 'geo',
      label,
      remove: () => { onRemoveFilter('latitude'); onRemoveFilter('longitude'); onRemoveFilter('radius_km'); },
    });
  }

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {badges.map(({ key, label, remove }) => (
        <Badge key={key} label={label} onRemove={remove} />
      ))}
      {badges.length >= 2 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700 underline ml-1"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
};

export default SearchActiveFilters;
