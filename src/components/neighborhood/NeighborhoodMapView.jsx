import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProperties } from '@/hooks/useProperties';
import { getScoreColor } from '@/utils/constants';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const COLOR_HEX = {
  green:  '#22c55e',
  lime:   '#84cc16',
  yellow: '#eab308',
  red:    '#ef4444',
  gray:   '#9ca3af',
};

const LEGEND = [
  { color: '#22c55e', label: 'Excellent (≥4.0)' },
  { color: '#84cc16', label: 'Bien (≥3.0)' },
  { color: '#eab308', label: 'Moyen (≥2.0)' },
  { color: '#ef4444', label: 'Mauvais (<2.0)' },
];

const NeighborhoodMapView = ({ city = 'Yaoundé', onMarkerClick }) => {
  const { data } = useProperties({ city, per_page: 50 });
  const properties = data?.data ?? [];

  // Group by neighborhood + average score
  const groups = {};
  properties.forEach((p) => {
    if (!p.latitude || !p.longitude) return;
    const key = `${p.city}__${p.neighborhood ?? ''}`;
    if (!groups[key]) {
      groups[key] = {
        city: p.city,
        neighborhood: p.neighborhood ?? '',
        lat: parseFloat(p.latitude),
        lng: parseFloat(p.longitude),
        score: p.neighborhood_global_score ?? null,
        count: 0,
      };
    }
    groups[key].count += 1;
    if (p.neighborhood_global_score) {
      groups[key].score = p.neighborhood_global_score;
    }
  });

  const zones = Object.values(groups);

  if (zones.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-400">Aucun score disponible pour cette ville.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[3.8667, 11.5167]}
        zoom={12}
        className="h-72 rounded-xl z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => {
          const color = getScoreColor(zone.score);
          const hex = COLOR_HEX[color] ?? COLOR_HEX.gray;
          return (
            <CircleMarker
              key={`${zone.city}__${zone.neighborhood}`}
              center={[zone.lat, zone.lng]}
              radius={18}
              pathOptions={{ color: hex, fillColor: hex, fillOpacity: 0.55, weight: 2 }}
              eventHandlers={{
                click: () => onMarkerClick?.(zone.lat, zone.lng, zone.city, zone.neighborhood),
              }}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{zone.neighborhood || zone.city}</p>
                  {zone.score ? (
                    <p>Score : <strong style={{ color: hex }}>{zone.score.toFixed(1)}/5</strong></p>
                  ) : (
                    <p className="text-gray-400">Pas encore évalué</p>
                  )}
                  <p className="text-xs text-gray-500">{zone.count} annonce(s)</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-3 right-3 bg-white/90 rounded-xl border border-gray-200 px-3 py-2 shadow text-xs space-y-1 z-10">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodMapView;
