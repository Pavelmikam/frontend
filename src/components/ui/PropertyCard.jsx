import { Link } from 'react-router-dom';
import { Eye, MapPin, Maximize2, Grid } from 'lucide-react';
import Avatar from './Avatar';
import PropertyStatusBadge from './PropertyStatusBadge';
import PropertyApprovalBadge from './PropertyApprovalBadge';
import FavoriteButton from './FavoriteButton';
import { formatPrice, formatSurface, formatRooms, getPropertyTypeLabel } from '@/utils/formatters';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" fill="%23f3f4f6"><rect width="400" height="225"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14" font-family="sans-serif">Aucune photo</text></svg>';

const PropertyCard = ({ property, showOwner = false, showStatus = false }) => {
  const thumbnail = property.thumbnail_url
    || property.images?.[0]?.thumbnail_url
    || property.primary_image?.thumbnail_url
    || null;

  return (
    <Link
      to={`/annonces/${property.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={thumbnail || PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {getPropertyTypeLabel(property.type)}
          </span>
          {showStatus && <PropertyStatusBadge status={property.status} />}
          {!property.is_approved && <PropertyApprovalBadge isApproved={false} rejectionReason={property.rejection_reason} />}
        </div>

        {/* Favorite button — top right */}
        <div className="absolute top-2 right-2">
          <FavoriteButton
            propertyId={property.id}
            isFavorited={property.is_favorited ?? false}
            favoritesCount={property.favorites_count}
            size="sm"
            className="bg-white/80 hover:bg-white shadow-sm"
          />
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          <Eye className="h-3 w-3" />
          {property.views_count ?? 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug mb-2">
          {property.title}
        </h3>

        <p className="text-blue-600 font-bold text-base mb-3">
          {formatPrice(property.price)}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {[property.neighborhood, property.city].filter(Boolean).join(', ')}
          </span>
        </div>

        {showOwner && property.owner && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Avatar src={property.owner.avatar_thumb_url} name={property.owner.name} size="sm" />
            <span className="text-xs text-gray-600 truncate">{property.owner.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
