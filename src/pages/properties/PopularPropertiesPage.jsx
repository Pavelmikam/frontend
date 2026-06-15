import { Link } from 'react-router-dom';
import { TrendingUp, Eye, Home } from 'lucide-react';
import { usePopularProperties } from '@/hooks/useStatistics';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const PopularPropertiesPage = () => {
  const { data, isLoading } = usePopularProperties();
  const properties = data?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Annonces populaires</h1>
        </div>
        <p className="text-gray-500">Les biens les plus consultés par notre communauté</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucune annonce populaire pour l'instant</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, idx) => {
            const thumb = property.images?.find((i) => i.is_primary) ?? property.images?.[0];
            return (
              <Link
                key={property.id}
                to={`${ROUTES.ANNONCES}/${property.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-100">
                  {thumb ? (
                    <img
                      src={thumb.thumbnail_url || thumb.optimized_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Home className="h-10 w-10" />
                    </div>
                  )}
                  {/* Rang */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">
                    #{idx + 1}
                  </div>
                  {/* Badge vues */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                    <Eye className="h-3 w-3" />
                    {property.views_count ?? 0}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''}</p>
                  <p className="text-base font-bold text-blue-600 mt-2">{formatPrice(property.price)}/mois</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to={ROUTES.ANNONCES}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Voir toutes les annonces →
        </Link>
      </div>
    </div>
  );
};

export default PopularPropertiesPage;
