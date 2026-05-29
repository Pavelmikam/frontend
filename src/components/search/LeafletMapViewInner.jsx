import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import useMapSearch from '@/hooks/useMapSearch';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const CAMEROON_CENTER = [3.848, 11.502];

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  if (lat && lng) {
    map.setView([lat, lng], 12);
  }
  return null;
};

const LeafletMapViewInner = ({ filters, onPropertyClick }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useMapSearch(filters);
  const properties = data?.data ?? [];

  const hasGeo = filters?.latitude && filters?.longitude;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={CAMEROON_CENTER}
        zoom={6}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasGeo && (
          <>
            <RecenterMap lat={parseFloat(filters.latitude)} lng={parseFloat(filters.longitude)} />
            {filters.radius_km && (
              <Circle
                center={[parseFloat(filters.latitude), parseFloat(filters.longitude)]}
                radius={Number(filters.radius_km) * 1000}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
              />
            )}
          </>
        )}

        {properties.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          return (
            <Marker key={p.id} position={[parseFloat(p.latitude), parseFloat(p.longitude)]}>
              <Popup>
                <div className="min-w-[160px]">
                  {p.thumbnail_url && (
                    <img
                      src={p.thumbnail_url}
                      alt=""
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <p className="font-semibold text-sm truncate">{p.title || p.type}</p>
                  <p className="text-blue-600 text-sm font-medium">{formatPrice(parseFloat(p.price))}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onPropertyClick) onPropertyClick(p);
                      else navigate(`${ROUTES.ANNONCES}/${p.id}`);
                    }}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors"
                  >
                    Voir l'annonce
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-[1000]">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && properties.filter((p) => p.latitude && p.longitude).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
          <div className="bg-white/90 px-4 py-3 rounded-xl shadow text-sm text-gray-600 text-center">
            Aucune annonce géolocalisée dans cette zone
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafletMapViewInner;
