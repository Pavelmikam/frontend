import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Grid } from 'lucide-react';
import PropertyStatusBadge from './PropertyStatusBadge';
import FavoriteButton from './FavoriteButton';
import { formatPrice, formatSurface, formatRooms, getPropertyTypeLabel } from '@/utils/formatters';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" fill="%23f3f4f6"><rect width="240" height="160"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12" font-family="sans-serif">Aucune photo</text></svg>';

const PropertyCardList = ({ property }) => {
  const thumbnail = property.images?.[0]?.thumbnail_url
    || property.primary_image?.thumbnail_url
    || null;

  return (
    <Link
      to={`/annonces/${property.id}`}
      className="flex bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-56 overflow-hidden bg-gray-100">
        <img
          src={thumbnail || PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {getPropertyTypeLabel(property.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {property.title}
            </h3>
            <FavoriteButton
              propertyId={property.id}
              isFavorited={property.is_favorited ?? false}
              size="sm"
              className="flex-shrink-0"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {[property.neighborhood, property.city].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-blue-600 font-bold text-base">{formatPrice(property.price)}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {property.surface && (
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3 w-3" />
                {formatSurface(property.surface)}
              </span>
            )}
            {property.rooms && (
              <span className="flex items-center gap-1">
                <Grid className="h-3 w-3" />
                {formatRooms(property.rooms)}
              </span>
            )}
          </div>

          <div className="flex gap-1.5">
            <PropertyStatusBadge status={property.status} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCardList;
