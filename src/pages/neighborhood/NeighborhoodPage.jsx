import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { CITIES_CAMEROUN, NEIGHBORHOOD_CRITERIA } from '@/utils/constants';
import NeighborhoodReportModal from '@/components/neighborhood/NeighborhoodReportModal';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const LazyMap = lazy(() => import('@/components/neighborhood/NeighborhoodMapView'));

const NeighborhoodPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState('Yaoundé');
  const [showModal, setShowModal] = useState(false);

  const handleEvaluate = () => {
    if (isAuthenticated) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <MapPin className="h-4 w-4" />
            Fonctionnalité exclusive ImmoConnect
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Score de Quartier ImmoConnect</h1>
          <p className="text-blue-100 text-lg">
            Évaluez la qualité des services urbains de votre quartier et aidez les futurs locataires à choisir en connaissance de cause.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated ? (
              <button
                onClick={handleEvaluate}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Contribuer maintenant
              </button>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Se connecter pour contribuer
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Filtre ville + carte */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Carte des scores par quartier</h2>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CITIES_CAMEROUN.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Suspense fallback={<div className="h-72 flex items-center justify-center"><Spinner /></div>}>
            <LazyMap city={selectedCity} />
          </Suspense>
        </div>

        {/* 8 critères */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Les 8 critères évalués</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {NEIGHBORHOOD_CRITERIA.map((c) => (
              <div key={c.value} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
                <span className="text-3xl block mb-2">{c.icon}</span>
                <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                <p className="text-xs text-gray-500 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bas de page */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Contribuez à la communauté</h3>
          <p className="text-sm text-blue-700 mb-4">
            Chaque évaluation vous rapporte des points. Gagnez des badges et aidez des milliers de locataires camerounais.
          </p>
          {isAuthenticated ? (
            <button
              onClick={handleEvaluate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Évaluer un quartier
            </button>
          ) : (
            <Link
              to={ROUTES.REGISTER}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block"
            >
              Créer un compte gratuit
            </Link>
          )}
        </div>
      </div>

      <NeighborhoodReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        city={selectedCity}
      />
    </div>
  );
};

export default NeighborhoodPage;
