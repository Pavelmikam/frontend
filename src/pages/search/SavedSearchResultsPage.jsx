import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useSavedSearchResults, useSavedSearches } from '@/hooks/useSavedSearches';
import PropertyCard from '@/components/ui/PropertyCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ROUTES, PROPERTY_TYPES } from '@/utils/constants';

const buildCriteriaSummary = (criteria) => {
  if (!criteria) return '';
  const parts = [];
  if (criteria.type) {
    const t = PROPERTY_TYPES.find((x) => x.value === criteria.type);
    parts.push(t ? t.label : criteria.type);
  }
  if (criteria.city) parts.push(criteria.city);
  if (criteria.price_max) parts.push(`max ${Number(criteria.price_max).toLocaleString('fr-FR')} F`);
  if (criteria.rooms_min) parts.push(`≥ ${criteria.rooms_min} pièce(s)`);
  return parts.join(' · ');
};

const SavedSearchResultsPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSavedSearchResults(id, { page });
  const { data: searchesData } = useSavedSearches();

  const savedSearch = searchesData?.data?.find((s) => s.id === Number(id));
  const properties = data?.data ?? [];
  const meta = data?.meta ?? {};
  const lastPage = meta.last_page ?? 1;
  const summary = savedSearch ? buildCriteriaSummary(savedSearch.criteria) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={ROUTES.MES_RECHERCHES}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes recherches
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {savedSearch?.name || 'Résultats de la recherche'}
          </h1>
        </div>
        {summary && <p className="text-sm text-gray-500 mb-6">{summary}</p>}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="font-medium">Aucune annonce ne correspond à cette recherche.</p>
            <p className="text-sm mt-1">Les critères ne correspondent à aucun bien disponible.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {lastPage > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Précédent
                </Button>
                <span className="text-sm text-gray-600">Page {page} sur {lastPage}</span>
                <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedSearchResultsPage;
