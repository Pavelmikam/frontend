import { lazy, Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

const LeafletMapView = lazy(() => import('./LeafletMapViewInner'));

const PropertyMapView = ({ filters, onPropertyClick }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '500px' }}>
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center bg-gray-50">
            <Spinner size="lg" />
          </div>
        }
      >
        <LeafletMapView filters={filters} onPropertyClick={onPropertyClick} />
      </Suspense>
    </div>
  );
};

export default PropertyMapView;
