import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatters';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const YAOUNDE_CENTER = [3.8667, 11.5167];

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  if (lat && lng) map.setView([lat, lng], 12);
  return null;
};

const PropertiesMapView = ({ properties = [], isLoading = false, filters = {} }) => {
  const hasGeo = filters.latitude && filters.longitude;
  const geoProperties = properties.filter((p) => p.latitude && p.longitude);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={YAOUNDE_CENTER}
        zoom={6}
        scrollWheelZoom={false}
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

        {geoProperties.map((p) => (
          <Marker key={p.id} position={[parseFloat(p.latitude), parseFloat(p.longitude)]}>
            <Popup>
              <div className="min-w-[160px]">
                {p.thumbnail_url && (
                  <img
                    src={p.thumbnail_url}
                    alt=""
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <p className="font-semibold text-sm truncate">{p.title || p.type}</p>
                <p className="text-blue-600 text-sm font-medium">
                  {formatPrice(parseFloat(p.price))}
                </p>
                <Link
                  to={`/annonces/${p.id}`}
                  className="mt-2 block w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded text-center transition-colors"
                >
                  Voir l'annonce →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-[1000]">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && geoProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
          <div className="bg-white/90 px-4 py-3 rounded-xl shadow text-sm text-gray-600 text-center">
            Aucune annonce géolocalisée dans cette zone
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesMapView;
