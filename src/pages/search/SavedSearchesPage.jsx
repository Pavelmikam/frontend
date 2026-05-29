import { useNavigate } from 'react-router-dom';
import { Bookmark, Search } from 'lucide-react';
import { useSavedSearchesList, useSavedSearchMutations } from '@/hooks/useSavedSearches';
import SavedSearchCard from '@/components/search/SavedSearchCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { filtersToQueryString } from '@/utils/formatters';
import { ROUTES, MAX_SAVED_SEARCHES } from '@/utils/constants';

const SavedSearchesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useSavedSearchesList();
  const mutations = useSavedSearchMutations();

  const searches = data?.data ?? [];
  const count = searches.length;
  const nearLimit = count >= MAX_SAVED_SEARCHES - 2;

  const handleRunSearch = (criteria) => {
    const qs = filtersToQueryString(criteria || {});
    navigate(`${ROUTES.ANNONCES}${qs ? `?${qs}` : ''}`);
  };

  const handleToggleNotifications = (id) => {
    mutations.toggleNotifications.mutate(id);
  };

  const handleDelete = (id) => {
    mutations.delete.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Mes recherches sauvegardées</h1>
        </div>

        {/* Counter + progress */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">{count} / {MAX_SAVED_SEARCHES} recherches</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                nearLimit ? 'bg-orange-400' : 'bg-blue-500'
              }`}
              style={{ width: `${(count / MAX_SAVED_SEARCHES) * 100}%` }}
            />
          </div>
          {nearLimit && count < MAX_SAVED_SEARCHES && (
            <p className="text-xs text-orange-500 mt-1">
              Vous approchez de la limite de {MAX_SAVED_SEARCHES} recherches sauvegardées.
            </p>
          )}
          {count >= MAX_SAVED_SEARCHES && (
            <p className="text-xs text-red-500 mt-1">
              Limite atteinte. Supprimez une recherche pour en ajouter une nouvelle.
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : searches.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-700">Vous n'avez pas encore de recherches sauvegardées.</p>
            <p className="text-sm mt-1">Sauvegardez vos critères de recherche depuis la page des annonces.</p>
            <Button variant="primary" className="mt-5" onClick={() => navigate(ROUTES.ANNONCES)}>
              <Search className="h-4 w-4 mr-2" />
              Lancer une recherche
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((s) => (
              <SavedSearchCard
                key={s.id}
                savedSearch={s}
                onDelete={handleDelete}
                onToggleNotifications={handleToggleNotifications}
                onRunSearch={handleRunSearch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;
