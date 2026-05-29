import { lazy, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

const LeafletMap = lazy(() => import('./LeafletMapInner'));

const PropertyLocationMap = ({ latitude, longitude, title, address }) => {
  if (!latitude || !longitude) {
    return (
      <div className="h-40 rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400">
        <MapPin className="h-8 w-8" />
        <p className="text-sm">Localisation non disponible</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <Suspense fallback={
        <div className="h-64 flex items-center justify-center bg-gray-50">
          <Spinner size="md" />
        </div>
      }>
        <LeafletMap
          latitude={parseFloat(latitude)}
          longitude={parseFloat(longitude)}
          title={title}
          address={address}
        />
      </Suspense>
    </div>
  );
};

export default PropertyLocationMap;
