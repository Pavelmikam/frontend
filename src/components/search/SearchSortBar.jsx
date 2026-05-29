import { LayoutGrid, List, Map, Loader2 } from 'lucide-react';
import Select from '@/components/ui/Select';
import { SORT_OPTIONS } from '@/utils/constants';

const VIEW_MODES = [
  { value: 'grid', icon: LayoutGrid, label: 'Grille' },
  { value: 'list', icon: List, label: 'Liste' },
  { value: 'map', icon: Map, label: 'Carte' },
];

const SearchSortBar = ({ total, sort, onSortChange, isFetching, viewMode, onViewModeChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {total != null ? (
            <>
              <strong className="text-gray-900">{total}</strong>{' '}
              annonce{total !== 1 ? 's' : ''} trouvée{total !== 1 ? 's' : ''}
            </>
          ) : (
            'Chargement...'
          )}
        </span>
        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
      </div>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="w-44">
          <Select
            options={SORT_OPTIONS}
            value={sort || ''}
            onChange={(e) => onSortChange(e.target.value)}
            placeholder="Trier par..."
          />
        </div>

        {/* View mode toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {VIEW_MODES.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onViewModeChange(value)}
              className={`px-3 py-2 transition-colors ${
                viewMode === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              title={label}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSortBar;
