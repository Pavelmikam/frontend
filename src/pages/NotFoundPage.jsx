import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-6xl font-bold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-6">La page que vous recherchez n'existe pas.</p>
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
