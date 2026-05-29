import { useState } from 'react';
import ReactSlider from 'react-slider';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, MapPin, Navigation } from 'lucide-react';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { PROPERTY_TYPES, CITIES_CAMEROUN, AMENITIES, PRICE_RANGE, SURFACE_RANGE, RADIUS_OPTIONS } from '@/utils/constants';
import { formatPriceShort } from '@/utils/formatters';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const typeOptions = [
  { value: '', label: 'Tous les types' },
  ...PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

const cityOptions = [
  { value: '', label: 'Toutes les villes' },
  ...CITIES_CAMEROUN.map((c) => ({ value: c, label: c })),
];

const radiusOptions = RADIUS_OPTIONS.map((r) => ({ value: String(r.value), label: r.label }));

const SearchFiltersPanel = ({ filters, onUpdate, onReset, isLoading, activeFiltersCount }) => {
  const [priceRange, setPriceRange] = useState([
    Number(filters.price_min) || PRICE_RANGE.min,
    Number(filters.price_max) || PRICE_RANGE.max,
  ]);
  const [surfaceRange, setSurfaceRange] = useState([
    Number(filters.surface_min) || SURFACE_RANGE.min,
    Number(filters.surface_max) || SURFACE_RANGE.max,
  ]);

  const selectedAmenities = filters.amenities
    ? Array.isArray(filters.amenities) ? filters.amenities : [filters.amenities]
    : [];

  const toggleAmenity = (value) => {
    const next = selectedAmenities.includes(value)
      ? selectedAmenities.filter((v) => v !== value)
      : [...selectedAmenities, value];
    onUpdate({ amenities: next });
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast.error('Géolocalisation non disponible');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUpdate({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => toast.error('Géolocalisation refusée')
    );
  };

  const hasGeo = filters.latitude && filters.longitude;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">Filtres</h3>
        {activeFiltersCount > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Section 1 — Filtres de base */}
      <div className="space-y-3 pb-3 border-b border-gray-100">
        <Select
          label="Ville"
          options={cityOptions}
          value={filters.city || ''}
          onChange={(e) => onUpdate({ city: e.target.value || null })}
        />
        <Select
          label="Type de bien"
          options={typeOptions}
          value={filters.type || ''}
          onChange={(e) => onUpdate({ type: e.target.value || null })}
        />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Quartier</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: Bastos, Akwa..."
            value={filters.neighborhood || ''}
            onChange={(e) => onUpdate({ neighborhood: e.target.value || null })}
          />
        </div>
      </div>

      {/* Section 2 — Numériques */}
      <Accordion title="Prix & Surface" defaultOpen>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Prix</span>
              <span>{formatPriceShort(priceRange[0])} — {formatPriceShort(priceRange[1])}</span>
            </div>
            <ReactSlider
              className="h-4 flex items-center"
              thumbClassName="w-4 h-4 bg-blue-600 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-blue-400"
              trackClassName="h-1 bg-gray-200 [&.track-1]:bg-blue-500"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={PRICE_RANGE.step}
              value={priceRange}
              onChange={setPriceRange}
              onAfterChange={([min, max]) => onUpdate({ price_min: min || null, price_max: max >= PRICE_RANGE.max ? null : max })}
              pearling
              minDistance={PRICE_RANGE.step}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Surface</span>
              <span>{surfaceRange[0]} — {surfaceRange[1]} m²</span>
            </div>
            <ReactSlider
              className="h-4 flex items-center"
              thumbClassName="w-4 h-4 bg-blue-600 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-blue-400"
              trackClassName="h-1 bg-gray-200 [&.track-1]:bg-blue-500"
              min={SURFACE_RANGE.min}
              max={SURFACE_RANGE.max}
              step={SURFACE_RANGE.step}
              value={surfaceRange}
              onChange={setSurfaceRange}
              onAfterChange={([min, max]) => onUpdate({ surface_min: min || null, surface_max: max >= SURFACE_RANGE.max ? null : max })}
              pearling
              minDistance={SURFACE_RANGE.step}
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Pièces minimum</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((n) => {
                const val = n === '5+' ? '5' : String(n);
                const active = filters.rooms_min === val || (n === '5+' && Number(filters.rooms_min) >= 5);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onUpdate({ rooms_min: active ? null : val })}
                    className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Accordion>

      {/* Section 3 — Équipements */}
      <Accordion title="Équipements">
        <div className="space-y-1">
          {selectedAmenities.length > 0 && (
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline mb-2 block"
              onClick={() => onUpdate({ amenities: [] })}
            >
              Tout désélectionner
            </button>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {AMENITIES.map((a) => {
              const checked = selectedAmenities.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors text-left ${
                    checked
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  <span>{a.icon}</span>
                  <span className="truncate">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Accordion>

      {/* Section 4 — Disponibilité */}
      <Accordion title="Disponibilité">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Disponible à partir du</label>
          <input
            type="date"
            min={today}
            value={filters.available_from || ''}
            onChange={(e) => onUpdate({ available_from: e.target.value || null })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </Accordion>

      {/* Section 5 — Géolocalisation */}
      <Accordion title="Proximité">
        <div className="space-y-3">
          {!hasGeo ? (
            <button
              type="button"
              onClick={handleGeolocate}
              className="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Utiliser ma position
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <MapPin className="h-4 w-4" />
                <span>Position obtenue ✓</span>
              </div>
              <Select
                label="Rayon de recherche"
                options={radiusOptions}
                value={String(filters.radius_km || 5)}
                onChange={(e) => onUpdate({ radius_km: e.target.value })}
              />
              <button
                type="button"
                onClick={() => onUpdate({ latitude: null, longitude: null, radius_km: null })}
                className="text-xs text-red-500 hover:underline"
              >
                Supprimer la position
              </button>
            </>
          )}
        </div>
      </Accordion>

      {/* Reset */}
      <div className="pt-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={onReset}
          disabled={activeFiltersCount === 0 || isLoading}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default SearchFiltersPanel;
