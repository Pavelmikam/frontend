import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import useProperty from '@/hooks/useProperty';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import { useImageMutations } from '@/hooks/useImageMutations';
import PropertyFormSteps from '@/components/property/PropertyFormSteps';
import ImageReorderGrid from '@/components/property/ImageReorderGrid';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading, isError } = useProperty(id);
  const { updateProperty } = usePropertyMutations();
  const { deleteImage, reorderImages, setPrimary } = useImageMutations(id);
  const [error, setError] = useState('');

  const handleSubmit = async ({ data, images: newImages }) => {
    setError('');
    try {
      await updateProperty.mutateAsync({ id, data, newImages });
      navigate(`${ROUTES.ANNONCES}/${id}`);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la mise à jour.');
      throw e;
    }
  };

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
        <p className="font-medium">Bien introuvable ou accès refusé.</p>
        <Link to={ROUTES.MES_ANNONCES} className="mt-3 text-blue-600 hover:underline text-sm">
          Retour à mes annonces
        </Link>
      </div>
    );
  }

  const defaultValues = {
    type: property.type ?? '',
    title: property.title ?? '',
    description: property.description ?? '',
    address: property.address ?? '',
    city: property.city ?? '',
    neighborhood: property.neighborhood ?? '',
    latitude: property.latitude?.toString() ?? '',
    longitude: property.longitude?.toString() ?? '',
    price: property.price?.toString() ?? '',
    surface: property.surface?.toString() ?? '',
    rooms: property.rooms?.toString() ?? '',
    floor: property.floor?.toString() ?? '',
    deposit: property.deposit?.toString() ?? '',
    available_from: property.available_from ?? '',
    amenities: property.amenities ?? [],
    charges_included: property.charges_included ?? [],
    allow_pets: property.allow_pets ?? false,
    allow_smoking: property.allow_smoking ?? false,
    allow_children: property.allow_children ?? false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={ROUTES.MES_ANNONCES}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes annonces
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'annonce</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">{property.title}</p>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} className="mb-4" />}

        {/* Existing images management */}
        {property.images?.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Photos existantes</h2>
            <ImageReorderGrid
              images={property.images}
              propertyId={id}
              onReorder={(orderedImages) => reorderImages.mutate(orderedImages)}
              onDelete={(imageId) => deleteImage.mutate(imageId)}
              onSetPrimary={(imageId) => setPrimary.mutate(imageId)}
              isDeleting={deleteImage.isPending}
              isSettingPrimary={setPrimary.isPending}
            />
          </div>
        )}

        <PropertyFormSteps
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={updateProperty.isPending}
          isEdit
        />
      </div>
    </div>
  );
};

export default EditPropertyPage;
