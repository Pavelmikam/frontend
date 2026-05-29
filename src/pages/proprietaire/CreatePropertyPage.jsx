import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropertyFormSteps from '@/components/property/PropertyFormSteps';
import { usePropertyMutations } from '@/hooks/usePropertyMutations';
import Alert from '@/components/ui/Alert';
import { useState } from 'react';
import { ROUTES } from '@/utils/constants';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const { createProperty } = usePropertyMutations();
  const [error, setError] = useState('');

  const handleSubmit = async ({ data, images }) => {
    setError('');
    try {
      const property = await createProperty.mutateAsync({ data, images });
      navigate(`${ROUTES.ANNONCES}/${property.id}`);
    } catch (e) {
      setError(e.userMessage || 'Erreur lors de la création de l\'annonce.');
      throw e;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Déposer une annonce</h1>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez les informations de votre bien en quelques étapes.
          </p>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} className="mb-4" />}

        <PropertyFormSteps
          onSubmit={handleSubmit}
          isSubmitting={createProperty.isPending}
        />
      </div>
    </div>
  );
};

export default CreatePropertyPage;
