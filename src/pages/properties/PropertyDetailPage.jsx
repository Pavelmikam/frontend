import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  MapPin, BedDouble, Maximize2, Building2, ArrowLeft,
  Eye, Heart, Calendar, Phone, Mail, ChevronLeft, ChevronRight,
  Pencil, Trash2
} from 'lucide-react';
import useProperty from '@/hooks/useProperty';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import useAuthStore from '@/store/authStore';
import PropertyLocationMap from '@/components/property/PropertyLocationMap';
import PropertyAmenitiesGrid from '@/components/property/PropertyAmenitiesGrid';
import PropertyStatusBadge from '@/components/ui/PropertyStatusBadge';
import PropertyApprovalBadge from '@/components/ui/PropertyApprovalBadge';
import FavoriteButton from '@/components/ui/FavoriteButton';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { formatPrice, formatSurface, formatRooms, getPropertyTypeLabel } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data: property, isLoading, isError } = useProperty(id);
  const { deleteProperty } = usePropertyMutations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <Building2 className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">Bien introuvable</p>
        <Link to={ROUTES.ANNONCES} className="mt-4 text-blue-600 hover:underline text-sm">
          Retour aux annonces
        </Link>
      </div>
    );
  }

  const images = property.images ?? [];
  const currentImage = images[currentImageIndex];
  const isOwner = isAuthenticated && user?.id === property.owner?.id;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handlePrevImage = () => setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const handleNextImage = () => setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  const handleDelete = async () => {
    try {
      await deleteProperty.mutateAsync(property.id);
      navigate(isOwner ? ROUTES.MES_ANNONCES : ROUTES.ANNONCES);
    } catch {
      // error shown via mutation
    }
  };

  const formattedDate = property.created_at
    ? new Date(property.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to={ROUTES.ANNONCES}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative bg-gray-200 rounded-xl overflow-hidden aspect-video">
              {images.length > 0 ? (
                <>
                  <img
                    src={currentImage?.optimized_url || currentImage?.original_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                        aria-label="Image suivante"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Building2 className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.thumbnail_url || img.optimized_url}
                      alt={`Vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <PropertyStatusBadge status={property.status} />
                <PropertyApprovalBadge isApproved={property.is_approved} rejectionReason={property.rejection_reason} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{property.title}</h1>
                <FavoriteButton
                  propertyId={property.id}
                  isFavorited={property.is_favorited ?? false}
                  favoritesCount={property.favorites_count}
                  size="md"
                />
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{[property.neighborhood, property.city].filter(Boolean).join(', ')}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{property.views_count ?? 0} vue(s)</span>
                  {property.favorites_count != null && (
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{property.favorites_count} favori(s)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Building2 className="h-5 w-5" />, label: 'Type', value: getPropertyTypeLabel(property.type) },
                { icon: <Maximize2 className="h-5 w-5" />, label: 'Surface', value: formatSurface(property.surface) },
                { icon: <BedDouble className="h-5 w-5" />, label: 'Pièces', value: formatRooms(property.rooms) },
                { icon: <Eye className="h-5 w-5" />, label: 'Vues', value: property.views_count ?? 0 },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <div className="flex justify-center text-blue-600 mb-1">{icon}</div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold text-gray-800 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Extra details */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Détails</h2>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {property.floor != null && (
                  <>
                    <dt className="text-gray-500">Étage</dt>
                    <dd className="font-medium text-gray-800">{property.floor === 0 ? 'RDC' : `${property.floor}e`}</dd>
                  </>
                )}
                {property.deposit != null && (
                  <>
                    <dt className="text-gray-500">Caution</dt>
                    <dd className="font-medium text-gray-800">{formatPrice(property.deposit)}</dd>
                  </>
                )}
                {property.available_from && (
                  <>
                    <dt className="text-gray-500">Disponible dès</dt>
                    <dd className="font-medium text-gray-800">
                      {new Date(property.available_from).toLocaleDateString('fr-FR')}
                    </dd>
                  </>
                )}
                {property.address && (
                  <>
                    <dt className="text-gray-500">Adresse</dt>
                    <dd className="font-medium text-gray-800">{property.address}</dd>
                  </>
                )}
              </dl>
            </div>

            {/* Amenities */}
            {(property.amenities?.length > 0 || property.charges_included?.length > 0) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Équipements & charges</h2>
                <PropertyAmenitiesGrid
                  amenities={property.amenities}
                  chargesIncluded={property.charges_included}
                />
              </div>
            )}

            {/* Rules */}
            {(property.allow_pets || property.allow_smoking || property.allow_children) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Règles</h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  {property.allow_pets && <li>✅ Animaux acceptés</li>}
                  {property.allow_smoking && <li>✅ Fumeurs acceptés</li>}
                  {property.allow_children && <li>✅ Enfants bienvenus</li>}
                </ul>
              </div>
            )}

            {/* Map */}
            {(property.latitude || property.longitude) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Localisation</h2>
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                  address={property.address}
                />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
              <p className="text-2xl font-bold text-blue-700">{formatPrice(property.price)}</p>
              <p className="text-xs text-gray-400 mt-0.5">par mois</p>

              {formattedDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                  <Calendar className="h-3.5 w-3.5" />
                  Publié le {formattedDate}
                </div>
              )}

              {/* Owner info */}
              {property.owner && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Propriétaire</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                      {property.owner.first_name?.[0]}{property.owner.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {property.owner.first_name} {property.owner.last_name}
                      </p>
                      {property.owner.phone && (
                        <a href={`tel:${property.owner.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5">
                          <Phone className="h-3 w-3" />
                          {property.owner.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  {property.owner.email && (
                    <a
                      href={`mailto:${property.owner.email}`}
                      className="mt-3 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Contacter
                    </a>
                  )}
                </div>
              )}

              {/* Owner / Admin actions */}
              {(isOwner || isAdmin) && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {isOwner && (
                    <Link to={`${ROUTES.MES_ANNONCES}/${property.id}/modifier`}>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="danger"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer l'annonce"
      >
        <p className="text-sm text-gray-600 mb-6">
          Voulez-vous vraiment supprimer <strong>{property.title}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteProperty.isPending}
          >
            {deleteProperty.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetailPage;
