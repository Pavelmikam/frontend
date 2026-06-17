import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, Loader2 } from 'lucide-react';
import { NEIGHBORHOOD_CRITERIA } from '@/utils/constants';
import { useSubmitNeighborhoodReport } from '@/hooks/useNeighborhoodScore';
import Button from '@/components/ui/Button';

const STAR_LABELS = ['', 'Très mauvais', 'Mauvais', 'Moyen', 'Bien', 'Excellent'];

const schema = z.object({
  criterion:  z.string().min(1, 'Sélectionnez un critère'),
  score:      z.number().int().min(1, 'Note requise').max(5),
  latitude:   z.number({ required_error: 'Localisation requise' }),
  longitude:  z.number({ required_error: 'Localisation requise' }),
  comment:    z.string().max(500).optional(),
});

const NeighborhoodReportModal = ({
  isOpen,
  onClose,
  property = null,
  latitude: latProp = null,
  longitude: lngProp = null,
  city: cityProp = '',
  neighborhood: neighborhoodProp = '',
}) => {
  const initLat = property?.latitude ? parseFloat(property.latitude) : latProp;
  const initLng = property?.longitude ? parseFloat(property.longitude) : lngProp;
  const initCity = property?.city ?? cityProp;
  const initNeighborhood = property?.neighborhood ?? neighborhoodProp;

  const [hoveredStar, setHoveredStar] = useState(0);
  const [locating, setLocating] = useState(false);
  const [lat, setLat] = useState(initLat);
  const [lng, setLng] = useState(initLng);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      criterion: '',
      score: 0,
      latitude:  initLat ?? undefined,
      longitude: initLng ?? undefined,
      comment: '',
    },
  });

  const selectedCriterion = watch('criterion');
  const selectedScore = watch('score');
  const mutation = useSubmitNeighborhoodReport();

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setValue('latitude',  pos.coords.latitude);
        setValue('longitude', pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      city: initCity || undefined,
      neighborhood: initNeighborhood || undefined,
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Évaluer ce quartier</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Localisation */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            {initCity ? (
              <span className="text-sm text-blue-800">
                {[initNeighborhood, initCity].filter(Boolean).join(', ')}
              </span>
            ) : lat ? (
              <span className="text-sm text-blue-800">
                {lat.toFixed(4)}, {lng?.toFixed(4)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={locating}
                className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                {locating && <Loader2 className="h-3 w-3 animate-spin" />}
                Utiliser ma position actuelle
              </button>
            )}
          </div>
          {(errors.latitude || errors.longitude) && (
            <p className="text-xs text-red-600">Localisation requise</p>
          )}

          {/* Critère */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Critère <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NEIGHBORHOOD_CRITERIA.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('criterion', c.value, { shouldValidate: true })}
                  className={`p-2.5 rounded-xl border-2 text-center text-xs transition-all ${
                    selectedCriterion === c.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
            {errors.criterion && <p className="text-xs text-red-600 mt-1">{errors.criterion.message}</p>}
          </div>

          {/* Note */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Note <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoveredStar(n)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setValue('score', n, { shouldValidate: true })}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    n <= (hoveredStar || selectedScore) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {(hoveredStar || selectedScore) > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {STAR_LABELS[hoveredStar || selectedScore]}
              </p>
            )}
            {errors.score && <p className="text-xs text-red-600 mt-1">{errors.score.message}</p>}
          </div>

          {/* Commentaire */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Commentaire <span className="text-gray-400">(optionnel)</span>
            </label>
            <textarea
              {...register('comment')}
              rows={3}
              maxLength={500}
              placeholder="Décrivez votre expérience dans ce quartier..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info anti-spam */}
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
            Une seule évaluation par critère et par zone tous les 30 jours.
          </p>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Soumettre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NeighborhoodReportModal;
